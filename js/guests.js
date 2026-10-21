/**
 * Local-only guest and RSVP tracker. Guest details stay in this browser.
 */
class GuestManager {
  constructor(app) {
    this.app = app;
  }

  render() {
    const container = document.getElementById("guests-tab-content");
    if (!container) return;
    const guests = Array.isArray(this.app.currentEvent.guests) ? this.app.currentEvent.guests : [];
    const summary = AuraPlanCore.summarizeGuests(guests);

    container.innerHTML = `
      <div class="guest-dashboard">
        <section class="guest-intro glass-card">
          <div>
            <span class="badge badge-info">PRIVATE TO THIS BROWSER</span>
            <h2 class="card-title">Guests & RSVPs</h2>
            <p class="card-subtitle">Guest names and dietary notes are saved in this browser only. They are not synced or shared through public RSVP links.</p>
          </div>
        </section>
        <div class="metrics-grid guest-metrics">
          <div class="metric-card glass-card"><span class="metric-label">Guest records</span><strong class="metric-value">${summary.total}</strong></div>
          <div class="metric-card glass-card"><span class="metric-label">Attending</span><strong class="metric-value">${summary.attending}</strong></div>
          <div class="metric-card glass-card"><span class="metric-label">Awaiting response</span><strong class="metric-value">${summary.invited}</strong></div>
          <div class="metric-card glass-card"><span class="metric-label">Declined</span><strong class="metric-value">${summary.declined}</strong></div>
        </div>
        <form id="guest-form" class="glass-card guest-form" novalidate>
          <h3 class="card-title">Add a guest</h3>
          <div class="form-row">
            <div class="form-group"><label for="guest-name">Name <span aria-hidden="true">*</span></label><input id="guest-name" name="name" class="form-input" maxlength="100" required /></div>
            <div class="form-group"><label for="guest-email">Email (optional)</label><input id="guest-email" name="email" class="form-input" type="email" maxlength="254" autocomplete="email" /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="guest-dietary">Dietary preferences (optional)</label><input id="guest-dietary" name="dietary" class="form-input" maxlength="250" /></div>
            <div class="form-group"><label for="guest-status">RSVP status</label><select id="guest-status" name="status" class="form-input"><option>Invited</option><option>Attending</option><option>Declined</option></select></div>
          </div>
          <p id="guest-form-message" class="form-message" aria-live="polite"></p>
          <button class="btn btn-primary" type="submit">Add guest</button>
        </form>
        <section class="glass-card guest-list-section">
          <h3 class="card-title">Guest list</h3>
          ${guests.length ? `<div class="guest-list">${guests.map(guest => `
            <article class="guest-row" data-guest-id="${AuraPlanCore.escapeHTML(guest.id)}">
              <div class="guest-details">
                <strong>${AuraPlanCore.escapeHTML(guest.name)}</strong>
                ${guest.email ? `<span>${AuraPlanCore.escapeHTML(guest.email)}</span>` : ""}
                ${guest.dietary ? `<small>Dietary: ${AuraPlanCore.escapeHTML(guest.dietary)}</small>` : ""}
              </div>
              <label class="guest-status-label" for="guest-status-${AuraPlanCore.escapeHTML(guest.id)}">RSVP</label>
              <select id="guest-status-${AuraPlanCore.escapeHTML(guest.id)}" class="select-dropdown" data-guest-status="${AuraPlanCore.escapeHTML(guest.id)}">
                ${["Invited", "Attending", "Declined"].map(status => `<option ${guest.status === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
              <button type="button" class="btn btn-outline btn-sm" data-delete-guest="${AuraPlanCore.escapeHTML(guest.id)}" aria-label="Remove ${AuraPlanCore.escapeHTML(guest.name)}">Remove</button>
            </article>`).join("")}</div>` : '<p class="text-secondary">No guests yet. Add your first guest above.</p>'}
        </section>
      </div>
    `;

    document.getElementById("guest-form")?.addEventListener("submit", event => {
      event.preventDefault();
      this.addGuest(new FormData(event.currentTarget));
    });
    container.onchange = event => {
      const select = event.target.closest("[data-guest-status]");
      if (select) this.updateStatus(select.dataset.guestStatus, select.value);
    };
    container.onclick = event => {
      const button = event.target.closest("[data-delete-guest]");
      if (button) this.removeGuest(button.dataset.deleteGuest);
    };
  }

  addGuest(formData) {
    const input = Object.fromEntries(["name", "email", "dietary", "status"].map(key => [key, formData.get(key)]));
    const result = AuraPlanCore.validateGuest(input);
    const message = document.getElementById("guest-form-message");
    if (!result.valid) {
      message.textContent = result.errors.join(" ");
      message.classList.add("text-danger");
      return;
    }
    const event = this.app.currentEvent;
    if (!Array.isArray(event.guests)) event.guests = [];
    const id = globalThis.crypto?.randomUUID?.() || `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    event.guests.push({ id, ...result.guest });
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`${result.guest.name} added to the guest list`, "success");
  }

  updateStatus(id, status) {
    const guest = (this.app.currentEvent.guests || []).find(item => item.id === id);
    if (!guest) return;
    const result = AuraPlanCore.validateGuest({ ...guest, status });
    if (!result.valid) {
      this.app.showToast(result.errors.join(" "), "warning");
      this.render();
      return;
    }
    guest.status = result.guest.status;
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`RSVP updated for ${guest.name}`, "success");
  }

  removeGuest(id) {
    const event = this.app.currentEvent;
    const index = (event.guests || []).findIndex(guest => guest.id === id);
    if (index < 0) return;
    const [removed] = event.guests.splice(index, 1);
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`${removed.name} removed from the guest list`, "info");
  }
}
