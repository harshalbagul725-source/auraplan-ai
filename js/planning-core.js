(function (root, factory) {
  const core = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = core;
  } else {
    root.AuraPlanCore = core;
  }
})(typeof globalThis === "object" ? globalThis : this, function () {
  const GUEST_STATUSES = ["Invited", "Attending", "Declined"];

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

  function calculateBudget(event = {}) {
    const expenses = Array.isArray(event.expenses) ? event.expenses : [];
    const target = Number(event.targetBudget || 0);
    const totalEstimated = expenses.reduce((sum, item) => sum + Number(item.estimated || 0), 0);
    const totalActual = expenses.reduce((sum, item) => sum + Number(item.actual || item.estimated || 0), 0);
    const totalPaid = expenses.reduce((sum, item) => sum + Number(item.paid || 0), 0);
    const byCategory = {};

    expenses.forEach(item => {
      const category = item.category || "General";
      if (!byCategory[category]) {
        byCategory[category] = { actual: 0, estimated: 0, count: 0 };
      }
      byCategory[category].actual += Number(item.actual || item.estimated || 0);
      byCategory[category].estimated += Number(item.estimated || 0);
      byCategory[category].count += 1;
    });

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

  function buildEventPlan(event = {}, options = {}) {
    const expenses = Array.isArray(event.expenses) ? event.expenses : [];
    const milestones = Array.isArray(event.milestones) ? event.milestones : [];
    const schedule = Array.isArray(event.runOfShow) ? event.runOfShow : [];
    const ideas = Array.isArray(event.personalizedIdeas) ? event.personalizedIdeas : [];
    const estimateTotal = expenses.reduce((sum, expense) => sum + Number(expense.estimated || 0), 0);
    const actualTotal = expenses.reduce((sum, expense) => sum + Number(expense.actual || expense.estimated || 0), 0);
    const budget = Number(event.targetBudget || 0);
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
        guestCount: Number(event.guestCount || 0),
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
          estimated: Number(expense.estimated || 0),
          actual: Number(expense.actual || expense.estimated || 0)
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

  return { buildEventPlan, calculateBudget, createInvitation, escapeHTML, summarizeGuests, validateGuest };
});
