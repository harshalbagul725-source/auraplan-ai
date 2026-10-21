const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

async function openTab(page, id) {
  await page.locator(`[data-tab="${id}"]`).evaluate(tab => tab.click());
}

test("event creation validates input and saves a complete event plan", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New Event" }).click();

  const dialog = page.getByRole("dialog", { name: "Plan a New Event with AuraPlan AI" });
  await expect(dialog).toBeVisible();
  await page.locator("#new-evt-title").fill("");
  await page.locator("#new-evt-budget").fill("250");
  await page.locator("#new-evt-guests").fill("0");
  expect(await page.locator("#new-evt-budget").evaluate(input => input.validity.valid)).toBe(true);
  await page.locator("#new-evt-budget").fill("0");
  await page.getByRole("button", { name: "Create Event Plan" }).click();
  await expect(dialog).toBeVisible();
  expect(await page.locator("#new-evt-title").evaluate(input => input.validity.valueMissing)).toBe(true);
  expect(await page.locator("#new-evt-budget").evaluate(input => input.validity.valid)).toBe(false);
  expect(await page.locator("#new-evt-guests").evaluate(input => input.validity.rangeUnderflow)).toBe(true);

  const date = await page.evaluate(() => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString().slice(0, 10);
  });
  await page.locator("#new-evt-type").selectOption("community");
  await page.locator("#new-evt-title").fill("Jordan's Garden Celebration");
  await page.locator("#new-evt-date").fill(date);
  await page.locator("#new-evt-budget").fill("12575");
  await page.locator("#new-evt-guests").fill("45");
  await page.locator("#new-evt-location").fill("Riverside Conservatory");
  await page.locator("#new-evt-theme").fill("Evening garden");
  await page.getByRole("button", { name: "Create Event Plan" }).click();

  await expect(dialog).toBeHidden();
  await expect(page.locator("#toast-container")).toContainText('Created new plan: "Jordan\'s Garden Celebration"!');
  await expect(page.locator("#event-switcher-select")).toContainText("Jordan's Garden Celebration");
  await expect.poll(() => page.evaluate(() => {
    const events = JSON.parse(localStorage.getItem("auraplan_events"));
    return events.find(event => event.id === localStorage.getItem("auraplan_active_event"));
  })).toMatchObject({
    title: "Jordan's Garden Celebration",
    date,
    location: "Riverside Conservatory",
    guestCount: 45,
    targetBudget: 12575,
    theme: "Evening garden",
    expenses: expect.any(Array),
    milestones: expect.any(Array),
    runOfShow: expect.any(Array)
  });
  await page.reload();
  await expect(page.locator("#event-switcher-select")).toContainText("Jordan's Garden Celebration");
  await expect(page.locator("#event-switcher-select")).toHaveValue(/evt-community-/);
});

test("event dialog has accessible labels, traps keyboard focus, and restores focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "New Event" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Plan a New Event with AuraPlan AI" });
  await expect(page.locator("#new-evt-type")).toBeFocused();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);

  await page.locator("#modal-btn-close").focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Create Event Plan" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#modal-btn-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("event plan validates preferences and persists the generated brief and notes", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "planner");

  await page.locator("#planner-guests").fill("0");
  await page.locator("#planner-preferences-form").evaluate(form => form.requestSubmit());
  expect(await page.locator("#planner-guests").evaluate(input => input.validity.valid)).toBe(false);
  await expect(page.locator(".planner-empty")).toBeVisible();

  await page.locator("#planner-guests").fill("85");
  await page.locator("#planner-theme").fill("Evening garden celebration");
  await page.locator("#planner-preferences").fill("Accessible seating and dietary choices");
  await page.locator("#btn-generate-plan").evaluate(button => button.click());
  await expect(page.locator(".planner-results")).toBeVisible();
  await expect(page.locator(".planner-theme-summary")).toHaveText("Theme: Evening garden celebration");
  await expect(page.locator(".planner-list")).toHaveCount(4);

  await page.locator("#planner-notes").fill("Confirm accessible entrances");
  await page.locator("#planner-notes").dispatchEvent("change");
  await page.reload();
  await openTab(page, "planner");
  await expect(page.locator("#planner-notes")).toHaveValue("Confirm accessible entrances");
  await expect(page.locator(".planner-results")).toBeVisible();
});

test("guest workflow validates, safely renders, updates, removes, and persists RSVPs", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "guests");

  await page.locator("#guest-form").evaluate(form => form.requestSubmit());
  await expect(page.locator("#guest-form-message")).toHaveText("Guest name is required.");

  await page.locator("#guest-name").fill("<img src=x onerror=alert(1)>");
  await page.locator("#guest-email").fill("invalid-email");
  await page.locator("#guest-form").evaluate(form => form.requestSubmit());
  await expect(page.locator("#guest-form-message")).toHaveText("Enter a valid email address.");

  await page.locator("#guest-email").fill("jordan@example.test");
  await page.locator("#guest-status").selectOption("Attending");
  await page.locator("#guest-form").evaluate(form => form.requestSubmit());
  await expect(page.locator(".guest-row")).toHaveCount(1);
  await expect(page.locator(".guest-list")).toContainText("<img src=x onerror=alert(1)>");
  await expect(page.locator(".guest-list img")).toHaveCount(0);
  await expect(page.locator(".guest-metrics .metric-value").nth(1)).toHaveText("1");

  const guestId = await page.locator(".guest-row").getAttribute("data-guest-id");
  await page.locator(`[data-guest-status="${guestId}"]`).selectOption("Declined");
  await expect(page.locator(".guest-metrics .metric-value").nth(3)).toHaveText("1");
  await page.reload();
  await openTab(page, "guests");
  await expect(page.locator(".guest-row")).toHaveCount(1);

  await page.locator(`[data-delete-guest="${guestId}"]`).evaluate(button => button.click());
  await expect(page.locator(".guest-row")).toHaveCount(0);
});

test("invitation preview, validation, save, and print flow work", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "invitation");

  await page.locator("#invite-title").fill("");
  await page.locator("#invitation-form button[type=submit]").evaluate(button => button.click());
  expect(await page.locator("#invite-title").evaluate(input => input.validity.valid)).toBe(false);

  await page.locator("#invite-title").fill("Jordan's Garden Celebration");
  await page.locator("#invite-host").fill("Avery Taylor");
  await page.locator("#invite-theme").selectOption("forest");
  await expect(page.locator("#invitation-preview-title")).toHaveText("Jordan's Garden Celebration");
  await expect(page.locator("#invitation-preview")).toHaveCSS("--invitation-accent", "#346b54");

  await page.locator("#invitation-form button[type=submit]").evaluate(button => button.click());
  await expect(page.locator("#toast-container")).toContainText("Invitation saved");
  await page.evaluate(() => {
    window.print = () => { window.__auraPrintCalled = true; };
  });
  await page.locator("#btn-print-invitation").evaluate(button => button.click());
  await expect.poll(() => page.evaluate(() => window.__auraPrintCalled)).toBe(true);
  await expect(page.locator("body")).toHaveClass(/print-invitation/);
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator("body")).not.toHaveClass(/print-invitation/);
});

test("planning tabs support roving keyboard navigation and valid tab semantics", async ({ page }) => {
  await page.goto("/");
  const firstTab = page.locator("#tab-button-ai");
  await firstTab.focus();
  await firstTab.dispatchEvent("keydown", { key: "ArrowRight", bubbles: true });
  await expect(page.locator("#tab-button-budget")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#tab-budget")).toHaveAttribute("aria-hidden", "false");

  await page.locator("#tab-button-budget").dispatchEvent("keydown", { key: "End", bubbles: true });
  await expect(page.locator("#tab-button-invitation")).toHaveAttribute("aria-selected", "true");
  await page.locator("#tab-button-invitation").dispatchEvent("keydown", { key: "Home", bubbles: true });
  await expect(firstTab).toHaveAttribute("aria-selected", "true");
});

test("all application tabs in both themes have no WCAG 2.1 A/AA axe violations", async ({ page }) => {
  await page.goto("/");
  const violations = [];
  for (const theme of ["dark", "light"]) {
    const isLight = await page.locator("html").evaluate(element => element.classList.contains("theme-light"));
    if (isLight !== (theme === "light")) {
      await page.locator("#btn-toggle-theme").evaluate(button => button.click());
    }
    for (const id of ["ai", "budget", "timeline", "vendors", "ideas", "itinerary", "planner", "guests", "invitation"]) {
      await openTab(page, id);
      await page.locator(`#tab-${id}`).evaluate(pane => Promise.all(
        pane.getAnimations().filter(animation => animation.playState === "running").map(animation => animation.finished)
      ));
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      for (const violation of results.violations) {
        for (const node of violation.nodes) {
          violations.push({ theme, tab: id, rule: violation.id, impact: violation.impact, target: node.target });
        }
      }
    }
  }
  if (violations.length) {
    console.log(violations.map(item => `${item.theme} ${item.tab} ${item.rule} ${item.impact} ${item.target.join(", ")}`).join("\n"));
  }
  expect(violations).toEqual([]);
});

test("all application tabs fit common mobile, tablet, and desktop widths", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const id of ["ai", "budget", "timeline", "vendors", "ideas", "itinerary", "planner", "guests", "invitation"]) {
      await openTab(page, id);
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      expect(dimensions.scrollWidth, `${id} overflow at ${width}px`).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  }
});
