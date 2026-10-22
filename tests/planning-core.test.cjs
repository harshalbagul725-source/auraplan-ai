const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { runInNewContext } = require("node:vm");
const {
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
} = require("../js/planning-core.js");

test("builds a plan from saved event data without inventing schedule or ideas", () => {
  const event = {
    title: "Garden Party",
    type: "community",
    date: "2027-06-12",
    location: "Town Hall",
    guestCount: 40,
    targetBudget: 5000,
    expenses: [{ name: "Catering", category: "Food", estimated: 1500, actual: 1600 }],
    milestones: [{ id: "task-1", title: "Confirm venue", dueDate: "2027-05-01", status: "todo" }],
    runOfShow: [{ time: "10:00 AM", title: "Welcome", lead: "Host" }],
    personalizedIdeas: [{ title: "Local flower table", category: "Decor", description: "Seasonal flowers" }]
  };

  const plan = buildEventPlan(event, { preferences: "Accessible seating", generatedAt: "2027-05-03T12:00:00Z" });

  assert.equal(plan.source, "local-demo");
  assert.equal(plan.event.title, event.title);
  assert.equal(plan.preferences, "Accessible seating");
  assert.equal(plan.budget.estimated, 1500);
  assert.equal(plan.budget.actual, 1600);
  assert.equal(plan.budget.remaining, 3400);
  assert.equal(plan.budget.overBudget, false);
  assert.equal(plan.checklist[0].overdue, true);
  assert.deepEqual(plan.schedule.map(item => item.title), ["Welcome"]);
  assert.deepEqual(plan.ideas.map(item => item.title), ["Local flower table"]);
});

test("reports an over-budget event using actual expenses", () => {
  const plan = buildEventPlan({
    targetBudget: 100,
    expenses: [{ estimated: 80, actual: 125 }]
  });

  assert.equal(plan.budget.estimated, 80);
  assert.equal(plan.budget.actual, 125);
  assert.equal(plan.budget.remaining, -25);
  assert.equal(plan.budget.overBudget, true);
});

test("calculates estimated, actual, paid, and category totals from event expenses", () => {
  const result = calculateBudget({
    targetBudget: 1000,
    expenses: [
      { category: "Venue", estimated: 400, actual: 450, paid: 100 },
      { category: "Venue", estimated: 25, actual: 35, paid: 10 },
      { category: "Food", estimated: 250, actual: 0, paid: 250 },
      { estimated: 50, actual: 75 }
    ]
  });

  assert.deepEqual(result, {
    target: 1000,
    totalEstimated: 725,
    totalActual: 560,
    totalPaid: 360,
    balanceDue: 200,
    remainingCushion: 440,
    spentPercent: 56,
    byCategory: {
      Venue: { actual: 485, estimated: 425, count: 2 },
      Food: { actual: 0, estimated: 250, count: 1 },
      General: { actual: 75, estimated: 50, count: 1 }
    }
  });
});

test("handles empty expenses, invalid sections, and a zero budget", () => {
  assert.deepEqual(calculateBudget({ targetBudget: 0, expenses: "invalid" }), {
    target: 0,
    totalEstimated: 0,
    totalActual: 0,
    totalPaid: 0,
    balanceDue: 0,
    remainingCushion: 0,
    spentPercent: 0,
    byCategory: {}
  });
});

test("caps budget progress at 100 percent while preserving the overrun", () => {
  const result = calculateBudget({
    targetBudget: 100,
    expenses: [{ category: "Decor", estimated: 80, actual: 125, paid: 50 }]
  });

  assert.equal(result.spentPercent, 100);
  assert.equal(result.remainingCushion, -25);
  assert.equal(result.balanceDue, 75);
});

test("uses estimates only when actual costs are missing and ignores invalid stored amounts", () => {
  const result = calculateBudget({
    targetBudget: "1000",
    expenses: [
      { estimated: 100, paid: 20 },
      { estimated: 75, actual: 0, paid: 0 },
      { estimated: -50, actual: "invalid", paid: -1 }
    ]
  });

  assert.equal(result.totalEstimated, 175);
  assert.equal(result.totalActual, 100);
  assert.equal(result.totalPaid, 20);
  assert.equal(result.remainingCushion, 900);
});

test("validates expense details and payment amounts", () => {
  assert.equal(validateExpense({
    name: "Venue deposit",
    category: "Venue",
    estimated: "250",
    actual: "",
    paid: "100",
    status: "Deposit Paid"
  }).valid, true);

  const invalid = validateExpense({
    name: " ",
    estimated: "-1",
    actual: "10",
    paid: "11",
    status: "Unknown"
  });
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.errors, [
    "Expense name is required.",
    "Expense category is required.",
    "Estimated amount must be a non-negative number.",
    "Paid amount cannot exceed the actual amount.",
    "Select a valid payment status."
  ]);

  assert.equal(validateExpense({
    name: "Missing estimate",
    category: "Venue",
    estimated: "",
    due: "2027-02-31"
  }).valid, false);
  assert.deepEqual(validateExpense({
    name: "Invalid due date",
    category: "Venue",
    estimated: 25,
    due: "2027-02-31"
  }).errors, ["Enter a valid payment due date."]);
});

test("builds category-based starter vendor tasks for each supported event type", () => {
  const communityTasks = createStarterMilestones("community", "2027-06-12", "2027-05-01");

  assert.deepEqual(getVendorChecklist("wedding"), [
    "Venue", "Catering", "Photography", "Decor", "Entertainment", "Other"
  ]);
  assert.equal(communityTasks.some(task => task.category === "Permits & Safety"), true);
  assert.equal(communityTasks.every(task => task.dueDate > "2027-05-01" && task.dueDate < "2027-06-12" && task.status === "todo"), true);
  assert.equal(new Set(communityTasks.map(task => task.dueDate)).size, communityTasks.length);
  assert.equal(createStarterMilestones("birthday", "2027-06-12").some(task => task.category === "Cake & Desserts"), true);
});

test("summarizes budget, task progress, overdue work, and vendor checklist coverage", () => {
  const summary = summarizeDashboard({
    type: "wedding",
    targetBudget: 1000,
    expenses: [{ category: "Venue", estimated: 200, actual: 150 }],
    milestones: [
      { id: "late", title: "Overdue task", dueDate: "2027-05-01", status: "todo" },
      { id: "next", title: "Next task", dueDate: "2027-05-05", status: "in-progress" },
      { id: "done", title: "Finished task", dueDate: "2027-05-04", status: "done" }
    ],
    vendors: [
      { category: "Venue", status: "Confirmed" },
      { category: "Catering", status: "Researching" }
    ]
  }, "2027-05-03");

  assert.equal(summary.budget.remainingCushion, 850);
  assert.equal(summary.tasks.percentComplete, 33);
  assert.equal(summary.tasks.overdue, 1);
  assert.deepEqual(summary.tasks.upcoming.map(task => task.title), ["Next task"]);
  assert.equal(summary.vendorChecklist.covered, 2);
  assert.equal(summary.vendorChecklist.confirmed, 1);
});

test("personalizes deterministic idea prompts with event type, budget, guest count, theme, and priorities", () => {
  const ideas = buildPersonalizedIdeas({
    type: "community",
    targetBudget: 20000,
    currency: "USD",
    guestCount: 500,
    theme: "Harvest lights",
    planningPreferences: "Low-waste and wheelchair accessible"
  });

  assert.deepEqual(ideas.map(idea => idea.category), [
    "Theme", "Decor", "Food", "Activities", "Guest Experience"
  ]);
  assert.equal(ideas[0].description.includes("Harvest lights"), true);
  assert.equal(ideas[0].description.includes("Low-waste and wheelchair accessible"), true);
  assert.equal(ideas[0].description.includes("large guest group"), true);
  assert.equal(ideas[0].description.includes("USD 40 per guest"), true);
});

test("builds a safe empty plan when optional event sections are absent", () => {
  const plan = buildEventPlan({});

  assert.equal(plan.event.title, "Untitled event");
  assert.equal(plan.budget.target, 0);
  assert.equal(plan.budget.expenses.length, 0);
  assert.equal(plan.checklist.length, 0);
  assert.equal(plan.schedule.length, 0);
  assert.equal(plan.ideas.length, 0);
});

test("normalizes incomplete event details and optional planning entries", () => {
  const plan = buildEventPlan({
    expenses: [{}, { estimated: 25 }],
    milestones: [{ dueDate: "2027-05-01", status: "done" }, {}],
    runOfShow: [{}],
    personalizedIdeas: [{}]
  }, { generatedAt: "2027-05-03T12:00:00Z" });

  assert.deepEqual(plan.budget.expenses, [
    { category: "General", name: "Expense", estimated: 0, actual: 0 },
    { category: "General", name: "Expense", estimated: 25, actual: 25 }
  ]);
  assert.deepEqual(plan.checklist, [
    { id: "", title: "Untitled task", dueDate: "2027-05-01", status: "done", priority: "Normal", overdue: false },
    { id: "", title: "Untitled task", dueDate: "", status: "todo", priority: "Normal", overdue: false }
  ]);
  assert.deepEqual(plan.schedule, [
    { time: "", title: "Untitled cue", lead: "", location: "", notes: "" }
  ]);
  assert.deepEqual(plan.ideas, [
    { title: "Untitled concept", category: "Concept", description: "" }
  ]);
});

test("validates guest fields and rejects invalid email, long notes, and RSVP states", () => {
  assert.equal(validateGuest({ name: "Avery" }).valid, true);
  assert.deepEqual(validateGuest({ name: " ", email: "not-an-email" }).errors, [
    "Guest name is required.",
    "Enter a valid email address."
  ]);
  assert.equal(validateGuest({ name: "Avery", status: "Maybe" }).valid, false);
  assert.equal(validateGuest({ name: "Avery", dietary: "x".repeat(251) }).valid, false);
});

test("enforces guest name and email length limits", () => {
  const result = validateGuest({
    name: "A".repeat(101),
    email: "a".repeat(255),
    dietary: "Gluten free",
    status: "Invited"
  });

  assert.deepEqual(result.errors, [
    "Guest name must be 100 characters or fewer.",
    "Enter a valid email address."
  ]);
});

test("summarizes invited, attending, and declined guests separately", () => {
  assert.deepEqual(summarizeGuests([
    { status: "Invited" },
    { status: "Attending" },
    { status: "Attending" },
    { status: "Declined" },
    { status: "Unknown" }
  ]), { total: 5, invited: 2, attending: 2, declined: 1 });
});

test("escapes guest-provided content before rendering HTML", () => {
  assert.equal(escapeHTML(`<script a="b">&'`), "&lt;script a=&quot;b&quot;&gt;&amp;&#39;");
  assert.equal(escapeHTML(null), "");
});

test("creates an editable invitation using event details as defaults", () => {
  const invitation = createInvitation(
    { title: "Garden Party" },
    { host: "Avery", message: "Join us!", accent: "forest", style: "sans" }
  );

  assert.deepEqual(invitation, {
    host: "Avery",
    title: "Garden Party",
    message: "Join us!",
    rsvpBy: "",
    accent: "forest",
    style: "sans"
  });
});

test("uses safe event and invitation defaults when no draft is provided", () => {
  assert.deepEqual(createInvitation({ title: "Community Picnic" }), {
    host: "",
    title: "Community Picnic",
    message: "Please join us to celebrate.",
    rsvpBy: "",
    accent: "#8b5cf6",
    style: "serif"
  });
});

test("exposes the planning utilities through the browser global", () => {
  const browser = {};
  runInNewContext(
    readFileSync(require.resolve("../js/planning-core.js"), "utf8"),
    browser,
    { filename: require.resolve("../js/planning-core.js") }
  );

  assert.equal(typeof browser.AuraPlanCore.calculateBudget, "function");
  assert.equal(browser.AuraPlanCore.calculateBudget({ targetBudget: 100 }).remainingCushion, 100);
});
