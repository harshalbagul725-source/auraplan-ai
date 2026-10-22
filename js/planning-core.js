(function (root, factory) {
  const core = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = core;
  } else {
    root.AuraPlanCore = core;
  }
})(typeof globalThis === "object" ? globalThis : this, function () {
  const GUEST_STATUSES = ["Invited", "Attending", "Declined"];
  const EXPENSE_STATUSES = ["Pending", "Deposit Paid", "Paid"];
  const VENDOR_CHECKLISTS = {
    wedding: ["Venue", "Catering", "Photography", "Decor", "Entertainment", "Other"],
    birthday: ["Venue", "Catering", "Photography", "Decor", "Entertainment", "Cake & Desserts", "Other"],
    community: ["Venue", "Catering", "Photography", "Decor", "Entertainment", "Permits & Safety", "Sanitation", "Other"]
  };

  function toNonNegativeNumber(value, fallback = 0) {
    if (value === null || value === undefined || (typeof value === "string" && !value.trim())) return fallback;
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 ? amount : fallback;
  }

  function actualAmount(expense) {
    return expense.actual === null || expense.actual === undefined ||
      (typeof expense.actual === "string" && !expense.actual.trim())
      ? toNonNegativeNumber(expense.estimated)
      : toNonNegativeNumber(expense.actual);
  }

  function isValidISODate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
  }

  function getRecords(value) {
    return Array.isArray(value)
      ? value.filter(item => item && typeof item === "object" && !Array.isArray(item))
      : [];
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function validateGuest(input) {
    const guest = {
      name: String(input?.name ?? "").trim(),
      email: String(input?.email ?? "").trim(),
      dietary: String(input?.dietary ?? "").trim(),
      status: String(input?.status ?? "Invited")
    };
    const errors = [];

    if (!guest.name) errors.push("Guest name is required.");
    if (guest.name.length > 100) errors.push("Guest name must be 100 characters or fewer.");
    if (guest.email.length > 254 || (guest.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email))) {
      errors.push("Enter a valid email address.");
    }
    if (guest.dietary.length > 250) errors.push("Dietary notes must be 250 characters or fewer.");
    if (!GUEST_STATUSES.includes(guest.status)) errors.push("Select a valid RSVP status.");

    return { valid: errors.length === 0, errors, guest };
  }

  function summarizeGuests(guests = []) {
    return guests.reduce((summary, guest) => {
      summary.total += 1;
      if (guest.status === "Attending") summary.attending += 1;
      else if (guest.status === "Declined") summary.declined += 1;
      else summary.invited += 1;
      return summary;
    }, { total: 0, invited: 0, attending: 0, declined: 0 });
  }

  function validateExpense(input = {}) {
    const hasEstimate = input.estimated !== null && input.estimated !== undefined &&
      String(input.estimated).trim() !== "";
    const expense = {
      name: String(input.name ?? "").trim(),
      category: String(input.category ?? "").trim(),
      vendor: String(input.vendor ?? "").trim(),
      estimated: Number(input.estimated),
      actual: input.actual === null || input.actual === undefined ||
        (typeof input.actual === "string" && !input.actual.trim())
        ? Number(input.estimated)
        : Number(input.actual),
      paid: input.paid === null || input.paid === undefined ||
        (typeof input.paid === "string" && !input.paid.trim())
        ? 0
        : Number(input.paid),
      due: String(input.due ?? ""),
      status: String(input.status ?? "Pending")
    };
    const errors = [];

    if (!expense.name) errors.push("Expense name is required.");
    if (expense.name.length > 120) errors.push("Expense name must be 120 characters or fewer.");
    if (!expense.category) errors.push("Expense category is required.");
    if (expense.category.length > 80) errors.push("Expense category must be 80 characters or fewer.");
    if (expense.vendor.length > 120) errors.push("Vendor name must be 120 characters or fewer.");
    if (!hasEstimate) errors.push("Estimated amount is required.");

    for (const field of ["estimated", "actual", "paid"]) {
      if (!Number.isFinite(expense[field]) || expense[field] < 0) {
        errors.push(`${field === "paid" ? "Paid amount" : `${field[0].toUpperCase()}${field.slice(1)} amount`} must be a non-negative number.`);
      }
    }
    if (Number.isFinite(expense.actual) && Number.isFinite(expense.paid) && expense.paid > expense.actual) {
      errors.push("Paid amount cannot exceed the actual amount.");
    }
    if (!EXPENSE_STATUSES.includes(expense.status)) errors.push("Select a valid payment status.");
    if (expense.due && !isValidISODate(expense.due)) errors.push("Enter a valid payment due date.");

    return { valid: errors.length === 0, errors, expense };
  }

  function calculateBudget(event = {}) {
    const expenses = getRecords(event.expenses);
    const target = toNonNegativeNumber(event.targetBudget);
    const categoryTotals = new Map();
    let totalEstimated = 0;
    let totalActual = 0;
    let totalPaid = 0;

    expenses.forEach(item => {
      const estimated = toNonNegativeNumber(item.estimated);
      const actual = actualAmount(item);
      const paid = toNonNegativeNumber(item.paid);
      const category = String(item.category || "General");
      const totals = categoryTotals.get(category) || { actual: 0, estimated: 0, count: 0 };
      totals.actual += actual;
      totals.estimated += estimated;
      totals.count += 1;
      categoryTotals.set(category, totals);
      totalEstimated += estimated;
      totalActual += actual;
      totalPaid += paid;
    });

    const byCategory = Object.fromEntries(categoryTotals);
    return {
      target,
      totalEstimated,
      totalActual,
      totalPaid,
      balanceDue: totalActual - totalPaid,
      remainingCushion: target - totalActual,
      spentPercent: target > 0 ? Math.min(100, Math.round((totalActual / target) * 100)) : 0,
      byCategory
    };
  }

  function getVendorChecklist(eventType = "wedding") {
    const checklist = Object.prototype.hasOwnProperty.call(VENDOR_CHECKLISTS, eventType)
      ? VENDOR_CHECKLISTS[eventType]
      : VENDOR_CHECKLISTS.wedding;
    return [...checklist];
  }

  function createStarterMilestones(eventType, eventDate, today = new Date().toISOString().slice(0, 10)) {
    const categories = getVendorChecklist(eventType);
    const todayTimestamp = isValidISODate(today) ? Date.parse(`${today}T00:00:00Z`) : NaN;
    const eventTimestamp = isValidISODate(eventDate) ? Date.parse(`${eventDate}T00:00:00Z`) : NaN;
    const planningDays = Math.max(0, Math.floor((eventTimestamp - todayTimestamp) / 86400000));
    const canDistributeDeadlines = Number.isFinite(todayTimestamp) &&
      Number.isFinite(eventTimestamp) &&
      eventTimestamp >= todayTimestamp;

    return categories.map((category, index) => {
      const dueDate = canDistributeDeadlines
        ? new Date(todayTimestamp + planningDays * ((index + 1) / (categories.length + 1)) * 86400000)
          .toISOString()
          .slice(0, 10)
        : String(eventDate || "");
      return {
        id: `ms-new-${index + 1}`,
        phase: "Vendor Planning",
        title: category === "Other"
          ? "Confirm any additional event services"
          : `Research and book ${category.toLowerCase()}`,
        dueDate,
        owner: "Lead Organizer",
        status: "todo",
        category
      };
    });
  }

  function summarizeDashboard(event = {}, today = new Date().toISOString().slice(0, 10)) {
    const milestones = getRecords(event.milestones);
    const vendors = getRecords(event.vendors);
    const pendingMilestones = milestones.filter(item => item.status !== "done");
    const upcomingTasks = pendingMilestones
      .filter(item => isValidISODate(item.dueDate) && item.dueDate >= today)
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
      .slice(0, 4);
    const overdueTasks = pendingMilestones.filter(item =>
      isValidISODate(item.dueDate) && item.dueDate < today
    );
    const vendorChecklist = getVendorChecklist(event.type).map(category => {
      const matchingVendor = vendors.find(vendor => {
        const vendorCategory = String(vendor.category || "").toLowerCase();
        const normalizedCategory = category.toLowerCase();
        if (normalizedCategory === "photography") {
          return /photo|video|media/.test(vendorCategory);
        }
        if (normalizedCategory === "decor") {
          return /decor|floral|rentals/.test(vendorCategory);
        }
        if (normalizedCategory === "entertainment") {
          return /entertain|music|dj|audio|stage/.test(vendorCategory);
        }
        if (normalizedCategory === "other") {
          return /other|transport|officiant/.test(vendorCategory);
        }
        if (normalizedCategory === "sanitation") {
          return /sanitation|waste|restroom/.test(vendorCategory);
        }
        return vendorCategory.includes(normalizedCategory);
      });
      return {
        category,
        status: matchingVendor?.status || "",
        covered: Boolean(matchingVendor),
        confirmed: matchingVendor?.status === "Confirmed"
      };
    });

    return {
      budget: calculateBudget(event),
      tasks: {
        total: milestones.length,
        completed: milestones.length - pendingMilestones.length,
        percentComplete: milestones.length
          ? Math.round(((milestones.length - pendingMilestones.length) / milestones.length) * 100)
          : 0,
        overdue: overdueTasks.length,
        upcoming: upcomingTasks
      },
      vendorChecklist: {
        total: vendorChecklist.length,
        covered: vendorChecklist.filter(item => item.covered).length,
        confirmed: vendorChecklist.filter(item => item.confirmed).length,
        items: vendorChecklist
      }
    };
  }

  function buildPersonalizedIdeas(event = {}) {
    const ideasByType = {
      wedding: [
        ["Theme", "Golden-hour garden ceremony", "Carry the event theme into a consistent ceremony-to-reception color story."],
        ["Decor", "Reusable floral focal points", "Concentrate reusable arrangements at the ceremony and move them to the reception."],
        ["Food", "Seasonal shared menu", "Ask caterers for a seasonal menu with clearly labeled dietary alternatives."],
        ["Activities", "Guest story cards", "Invite guests to leave a short memory or piece of advice at each table."],
        ["Guest Experience", "Quiet conversation nook", "Set aside a calm, accessible seating area away from the dance floor."]
      ],
      birthday: [
        ["Theme", "Milestone memory gallery", "Build a visual theme around favorite eras, colors, and personal milestones."],
        ["Decor", "Flexible photo backdrop", "Create one reusable backdrop that works for photos and the cake moment."],
        ["Food", "Build-your-own dessert bar", "Offer a small set of clearly labeled toppings and dietary-friendly options."],
        ["Activities", "Personal trivia round", "Use a short, optional quiz about the guest of honor to bring people together."],
        ["Guest Experience", "Arrival playlist and welcome", "Set a welcoming tone with a short playlist and an easy-to-find greeting point."]
      ],
      community: [
        ["Theme", "Neighborhood-made festival", "Feature local colors, makers, and community stories in the event identity."],
        ["Decor", "Reusable wayfinding", "Use clear, reusable signs to identify entrances, stages, restrooms, and accessible routes."],
        ["Food", "Local vendor food court", "Group food vendors by service point and label common allergens and dietary options."],
        ["Activities", "Rotating community activity zone", "Schedule short, repeatable activities so guests can join without crowding one area."],
        ["Guest Experience", "Accessible welcome and rest area", "Provide a staffed information point, seating, shade, and accessible routes."]
      ]
    };
    const guestCount = Math.max(0, toNonNegativeNumber(event.guestCount));
    const targetBudget = toNonNegativeNumber(event.targetBudget);
    const guestScale = guestCount >= 250
      ? "For a large guest group, plan clear service zones and timed transitions."
      : guestCount > 0 && guestCount <= 40
        ? "For a smaller guest group, favor personal, participatory details."
        : "For this guest count, balance shared moments with easy movement.";
    const budgetContext = guestCount
      ? ` Planning target: ${String(event.currency || "USD")} ${Math.round(targetBudget / guestCount).toLocaleString()} per guest.`
      : "";
    const themeContext = String(event.theme || "").trim();
    const preferenceContext = String(event.planningPreferences || "").trim();
    const ideas = ideasByType[event.type] || ideasByType.community;

    return ideas.map(([category, title, description]) => ({
      category,
      title,
      description: [
        description,
        guestScale,
        themeContext ? `Theme: ${themeContext}.` : "",
        preferenceContext ? `Planning priority: ${preferenceContext}.` : "",
        budgetContext
      ].filter(Boolean).join(" "),
      impact: "Planning prompt"
    }));
  }

  function buildEventPlan(event = {}, options = {}) {
    const expenses = getRecords(event.expenses);
    const milestones = getRecords(event.milestones);
    const schedule = getRecords(event.runOfShow);
    const ideas = getRecords(event.personalizedIdeas);
    const estimateTotal = expenses.reduce((sum, expense) => sum + toNonNegativeNumber(expense.estimated), 0);
    const actualTotal = expenses.reduce((sum, expense) => sum + actualAmount(expense), 0);
    const budget = toNonNegativeNumber(event.targetBudget);
    const today = String(options.generatedAt || new Date().toISOString()).slice(0, 10);

    return {
      source: "local-demo",
      generatedAt: options.generatedAt || new Date().toISOString(),
      preferences: String(options.preferences ?? "").trim(),
      event: {
        title: String(event.title || "Untitled event"),
        type: String(event.type || "event"),
        date: String(event.date || ""),
        time: String(event.time || ""),
        location: String(event.location || ""),
        guestCount: toNonNegativeNumber(event.guestCount),
        theme: String(event.theme || "")
      },
      budget: {
        target: budget,
        estimated: estimateTotal,
        actual: actualTotal,
        remaining: budget - actualTotal,
        overBudget: actualTotal > budget,
        expenses: expenses.map(expense => ({
          category: String(expense.category || "General"),
          name: String(expense.name || "Expense"),
          estimated: toNonNegativeNumber(expense.estimated),
          actual: actualAmount(expense)
        }))
      },
      checklist: milestones.map(item => ({
        id: String(item.id || ""),
        title: String(item.title || "Untitled task"),
        dueDate: String(item.dueDate || ""),
        status: String(item.status || "todo"),
        priority: item.priority || "Normal",
        overdue: Boolean(item.dueDate && item.dueDate < today && item.status !== "done")
      })),
      schedule: schedule.map(item => ({
        time: String(item.time || ""),
        title: String(item.title || "Untitled cue"),
        lead: String(item.lead || ""),
        location: String(item.location || ""),
        notes: String(item.notes || "")
      })),
      ideas: ideas.map(idea => ({
        title: String(idea.title || "Untitled concept"),
        category: String(idea.category || "Concept"),
        description: String(idea.description || "")
      }))
    };
  }

  function createInvitation(event = {}, draft = {}) {
    return {
      host: String(draft.host ?? ""),
      title: String(draft.title ?? event.title ?? ""),
      message: String(draft.message ?? "Please join us to celebrate."),
      rsvpBy: String(draft.rsvpBy ?? ""),
      accent: String(draft.accent ?? "#8b5cf6"),
      style: String(draft.style ?? "serif")
    };
  }

  return {
    buildEventPlan,
    buildPersonalizedIdeas,
    calculateBudget,
    createInvitation,
    createStarterMilestones,
    escapeHTML,
    getVendorChecklist,
    summarizeDashboard,
    summarizeGuests,
    validateExpense,
    validateGuest
  };
});
