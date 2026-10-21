/**
 * Creates a structured local plan from the active event's saved information.
 * This is a demo planner, not a live generative AI service.
 */
class PlannerManager {
  constructor(app) {
    this.app = app;
  }

  render() {
    const container = document.getElementById("planner-tab-content");
    if (!container) return;

    const event = this.app.currentEvent;
    const plan = event.generatedPlan || null;

    container.innerHTML = `
      <div class="planner-dashboard">
        <section class="planner-intro glass-card">
          <div>
            <span class="badge badge-info">LOCAL DEMO PLANNER</span>
            <h2 class="card-title">Your event plan, in one place</h2>
            <p class="card-subtitle">Build a structured brief from your saved event, budget, ideas, checklist and schedule. No live AI or external quotes are used.</p>
          </div>
          <button class="btn btn-primary" id="btn-generate-plan">${plan ? "Regenerate Plan" : "Generate Event Plan"}</button>
        </section>

        <form id="planner-preferences-form" class="planner-preferences glass-card">
          <h3 class="card-title">Planning preferences</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="planner-theme">Event theme</label>
              <input id="planner-theme" class="form-input" maxlength="120" value="${AuraPlanCore.escapeHTML(event.theme || "")}" />
            </div>
            <div class="form-group">
              <label for="planner-guests">Expected guest count</label>
              <input id="planner-guests" class="form-input" type="number" min="1" max="100000" required value="${Number(event.guestCount || 1)}" />
            </div>
          </div>
          <div class="form-group">
            <label for="planner-preferences">What should the plan prioritize?</label>
            <textarea id="planner-preferences" class="form-input" rows="3" maxlength="500" placeholder="Accessibility, dietary needs, low-waste decor, a relaxed schedule...">${AuraPlanCore.escapeHTML(event.planningPreferences || "")}</textarea>
          </div>
          <div class="planner-actions">
            <button class="btn btn-outline" type="submit">Save planning details</button>
            <span class="text-secondary text-sm">Saved only in this browser.</span>
          </div>
        </form>

        ${plan ? this.renderPlan(plan, event.planNotes || "") : `
          <div class="empty-state glass-card planner-empty">
            <h3>No event plan generated yet</h3>
            <p>Generate a plan to organize the event details and planning records you have already saved.</p>
          </div>
        `}
      </div>
    `;

    document.getElementById("planner-preferences-form")?.addEventListener("submit", event => {
      event.preventDefault();
      this.savePreferences();
    });
    document.getElementById("btn-generate-plan")?.addEventListener("click", () => this.generate());
    document.getElementById("planner-notes")?.addEventListener("change", event => {
      this.app.currentEvent.planNotes = event.target.value;
      this.app.saveCurrentEvent();
      this.app.showToast("Plan notes saved", "success");
    });
  }

  renderPlan(plan, notes) {
    const budget = plan.budget;
    return `
      <section class="planner-results" aria-live="polite">
        <div class="planner-brief glass-card">
          <div class="planner-section-heading">
            <div>
              <span class="badge badge-neutral">SAVED EVENT BRIEF</span>
              <h3 class="card-title">${AuraPlanCore.escapeHTML(plan.event.title)}</h3>
              <p class="card-subtitle">${AuraPlanCore.escapeHTML([plan.event.date, plan.event.time, plan.event.location].filter(Boolean).join(" · "))}</p>
              ${plan.event.theme ? `<p class="card-subtitle planner-theme-summary">Theme: ${AuraPlanCore.escapeHTML(plan.event.theme)}</p>` : ""}
            </div>
            <span class="badge ${budget.overBudget ? "badge-danger" : "badge-success"}">${budget.overBudget ? "Over budget" : "Within budget"}</span>
          </div>
          <div class="planner-metrics">
            <div><span>Guests</span><strong>${plan.event.guestCount}</strong></div>
            <div><span>Target</span><strong>${this.app.budgetManager.formatCurrency(budget.target)}</strong></div>
            <div><span>Saved estimates</span><strong>${this.app.budgetManager.formatCurrency(budget.estimated)}</strong></div>
            <div><span>Remaining vs. actual</span><strong>${this.app.budgetManager.formatCurrency(budget.remaining)}</strong></div>
          </div>
          ${plan.preferences ? `<p class="planner-preference-summary"><strong>Priorities:</strong> ${AuraPlanCore.escapeHTML(plan.preferences)}</p>` : ""}
          <p class="planner-disclaimer">Estimates and schedule items are from your saved event data, not live vendor pricing. Generated ${AuraPlanCore.escapeHTML(new Date(plan.generatedAt).toLocaleString())}.</p>
        </div>

        <div class="planner-grid">
          <section class="glass-card planner-list">
            <h3 class="card-title">Planning checklist <span class="badge badge-neutral">${plan.checklist.length}</span></h3>
            ${plan.checklist.length ? `<ul>${plan.checklist.map(item => `
              <li class="planner-list-item">
                <span class="badge ${item.status === "done" ? "badge-success" : item.overdue ? "badge-danger" : "badge-neutral"}">${AuraPlanCore.escapeHTML(item.status)}${item.overdue ? " · overdue" : ""}</span>
                <span>${AuraPlanCore.escapeHTML(item.title)}${item.dueDate ? ` <small>${AuraPlanCore.escapeHTML(item.dueDate)}</small>` : ""}</span>
              </li>`).join("")}</ul>` : '<p class="text-secondary">Add milestones in Timeline to build your checklist.</p>'}
          </section>
          <section class="glass-card planner-list">
            <h3 class="card-title">Event-day schedule <span class="badge badge-neutral">${plan.schedule.length}</span></h3>
            ${plan.schedule.length ? `<ul>${plan.schedule.map(item => `
              <li class="planner-list-item">
                <strong>${AuraPlanCore.escapeHTML(item.time)}</strong>
                <span>${AuraPlanCore.escapeHTML(item.title)}${item.lead ? ` <small>· ${AuraPlanCore.escapeHTML(item.lead)}</small>` : ""}</span>
              </li>`).join("")}</ul>` : '<p class="text-secondary">Add run-of-show cues in Timeline to include a schedule.</p>'}
          </section>
          <section class="glass-card planner-list">
            <h3 class="card-title">Saved concepts <span class="badge badge-neutral">${plan.ideas.length}</span></h3>
            ${plan.ideas.length ? `<ul>${plan.ideas.map(idea => `
              <li class="planner-list-item">
                <span class="badge badge-info">${AuraPlanCore.escapeHTML(idea.category)}</span>
                <span><strong>${AuraPlanCore.escapeHTML(idea.title)}</strong><small>${AuraPlanCore.escapeHTML(idea.description)}</small></span>
              </li>`).join("")}</ul>` : '<p class="text-secondary">Add decor and activity concepts in Ideas to include them here.</p>'}
          </section>
          <section class="glass-card planner-list">
            <h3 class="card-title">Expense estimates <span class="badge badge-neutral">${plan.budget.expenses.length}</span></h3>
            ${plan.budget.expenses.length ? `<ul>${plan.budget.expenses.map(item => `
              <li class="planner-list-item">
                <span>${AuraPlanCore.escapeHTML(item.name)}<small>${AuraPlanCore.escapeHTML(item.category)}</small></span>
                <strong>${this.app.budgetManager.formatCurrency(item.estimated)}</strong>
              </li>`).join("")}</ul>` : '<p class="text-secondary">Add expenses in Budget to include estimates.</p>'}
          </section>
        </div>
        <section class="glass-card planner-notes">
          <label class="card-title" for="planner-notes">Editable plan notes</label>
          <textarea id="planner-notes" class="form-input" rows="4" maxlength="2000" placeholder="Add decisions, follow-ups, or edits for this plan">${AuraPlanCore.escapeHTML(notes)}</textarea>
          <p class="text-secondary text-sm">Changes are saved when you leave this field.</p>
        </section>
      </section>
    `;
  }

  savePreferences() {
    const form = document.getElementById("planner-preferences-form");
    if (!form.reportValidity()) return;
    const event = this.app.currentEvent;
    event.theme = document.getElementById("planner-theme").value.trim();
    event.guestCount = Number(document.getElementById("planner-guests").value);
    event.planningPreferences = document.getElementById("planner-preferences").value.trim();
    event.generatedPlan = null;
    this.app.saveCurrentEvent();
    this.app.renderHeaderDetails();
    this.render();
    this.app.showToast("Planning details saved. Regenerate the plan to refresh its brief.", "success");
  }

  generate() {
    const form = document.getElementById("planner-preferences-form");
    if (!form.reportValidity()) return;
    this.savePreferences();
    const event = this.app.currentEvent;
    event.generatedPlan = AuraPlanCore.buildEventPlan(event, {
      preferences: event.planningPreferences
    });
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast("Local demo plan generated from saved event data", "success");
  }
}
