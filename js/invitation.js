/**
 * Editable invitation preview saved with the event and exported through print.
 */
class InvitationManager {
  constructor(app) {
    this.app = app;
    this.themes = {
      violet: { label: "Aura Violet", color: "#6d5ce7" },
      rose: { label: "Rose", color: "#b64c70" },
      forest: { label: "Forest", color: "#346b54" },
      midnight: { label: "Midnight", color: "#31517d" }
    };
  }

  getDraft() {
    return AuraPlanCore.createInvitation(this.app.currentEvent, this.app.currentEvent.invitation || {});
  }

  render() {
    const container = document.getElementById("invitation-tab-content");
    if (!container) return;
    const event = this.app.currentEvent;
    const draft = this.getDraft();
    const theme = this.themes[draft.accent] ? draft.accent : "violet";

    container.innerHTML = `
      <div class="invitation-dashboard">
        <section class="glass-card invitation-intro">
          <div>
            <span class="badge badge-info">PRIVATE LOCAL PREVIEW</span>
            <h2 class="card-title">Invitation designer</h2>
            <p class="card-subtitle">Edit the invitation, save it with this event, then print or save it as a PDF. No public RSVP link is created.</p>
          </div>
        </section>
        <div class="invitation-workspace">
          <form id="invitation-form" class="glass-card invitation-editor">
            <div class="form-group"><label for="invite-host">Hosted by</label><input id="invite-host" class="form-input" maxlength="100" value="${AuraPlanCore.escapeHTML(draft.host)}" /></div>
            <div class="form-group"><label for="invite-title">Celebration title</label><input id="invite-title" class="form-input" maxlength="120" required value="${AuraPlanCore.escapeHTML(draft.title)}" /></div>
            <div class="form-group"><label for="invite-message">Invitation message</label><textarea id="invite-message" class="form-input" rows="4" maxlength="500">${AuraPlanCore.escapeHTML(draft.message)}</textarea></div>
            <div class="form-group"><label for="invite-rsvp">RSVP by (optional)</label><input id="invite-rsvp" class="form-input" type="date" value="${AuraPlanCore.escapeHTML(draft.rsvpBy)}" /></div>
            <div class="form-row">
              <div class="form-group"><label for="invite-theme">Color theme</label><select id="invite-theme" class="form-input">${Object.entries(this.themes).map(([key, value]) => `<option value="${key}" ${key === theme ? "selected" : ""}>${value.label}</option>`).join("")}</select></div>
              <div class="form-group"><label for="invite-style">Typography</label><select id="invite-style" class="form-input"><option value="serif" ${draft.style === "serif" ? "selected" : ""}>Classic serif</option><option value="sans" ${draft.style === "sans" ? "selected" : ""}>Modern sans</option></select></div>
            </div>
            <div class="planner-actions">
              <button class="btn btn-primary" type="submit">Save invitation</button>
              <button class="btn btn-outline" type="button" id="btn-print-invitation">Print / Save PDF</button>
            </div>
            <p class="text-secondary text-sm">Saved only in this browser with the current event.</p>
          </form>
          <article id="invitation-preview" class="invitation-preview ${AuraPlanCore.escapeHTML(draft.style === "sans" ? "sans" : "serif")}" style="--invitation-accent:${this.themes[theme].color}" aria-label="Invitation preview">
            <div class="invitation-preview-inner">
              <span class="invitation-kicker">YOU ARE INVITED</span>
              ${draft.host ? `<p class="invitation-host">${AuraPlanCore.escapeHTML(draft.host)} invite you to celebrate</p>` : ""}
              <h3 id="invitation-preview-title">${AuraPlanCore.escapeHTML(draft.title || event.title)}</h3>
              <p id="invitation-preview-message">${AuraPlanCore.escapeHTML(draft.message)}</p>
              <div class="invitation-details">
                <strong>${AuraPlanCore.escapeHTML(event.date)}${event.time ? ` · ${AuraPlanCore.escapeHTML(event.time)}` : ""}</strong>
                <span>${AuraPlanCore.escapeHTML(event.location || "Location to be announced")}</span>
                ${draft.rsvpBy ? `<small>Kindly reply by ${AuraPlanCore.escapeHTML(draft.rsvpBy)}</small>` : ""}
              </div>
              <span class="invitation-ornament" aria-hidden="true">✦</span>
            </div>
          </article>
        </div>
      </div>
    `;

    const form = document.getElementById("invitation-form");
    form?.addEventListener("input", () => this.updatePreview());
    form?.addEventListener("change", () => this.updatePreview());
    form?.addEventListener("submit", event => {
      event.preventDefault();
      this.save();
    });
    document.getElementById("btn-print-invitation")?.addEventListener("click", () => this.print());
  }

  readDraft() {
    return AuraPlanCore.createInvitation(this.app.currentEvent, {
      host: document.getElementById("invite-host").value.trim(),
      title: document.getElementById("invite-title").value.trim(),
      message: document.getElementById("invite-message").value.trim(),
      rsvpBy: document.getElementById("invite-rsvp").value,
      accent: document.getElementById("invite-theme").value,
      style: document.getElementById("invite-style").value
    });
  }

  updatePreview() {
    const draft = this.readDraft();
    const title = document.getElementById("invitation-preview-title");
    const message = document.getElementById("invitation-preview-message");
    const preview = document.getElementById("invitation-preview");
    if (title) title.textContent = draft.title || this.app.currentEvent.title;
    if (message) message.textContent = draft.message;
    if (preview) {
      preview.classList.toggle("sans", draft.style === "sans");
      preview.classList.toggle("serif", draft.style !== "sans");
      preview.style.setProperty("--invitation-accent", this.themes[draft.accent]?.color || this.themes.violet.color);
      preview.querySelector(".invitation-host")?.remove();
      if (draft.host) {
        const host = document.createElement("p");
        host.className = "invitation-host";
        host.textContent = `${draft.host} invite you to celebrate`;
        preview.querySelector(".invitation-preview-inner").insertBefore(host, title);
      }
      preview.querySelector(".invitation-details small")?.remove();
      if (draft.rsvpBy) {
        const reply = document.createElement("small");
        reply.textContent = `Kindly reply by ${draft.rsvpBy}`;
        preview.querySelector(".invitation-details").appendChild(reply);
      }
    }
  }

  save() {
    const form = document.getElementById("invitation-form");
    if (!form.reportValidity()) return false;
    this.app.currentEvent.invitation = this.readDraft();
    this.app.saveCurrentEvent();
    this.app.showToast("Invitation saved with this event", "success");
    return true;
  }

  print() {
    if (!this.save()) return;
    document.body.classList.add("print-invitation");
    window.addEventListener("afterprint", () => document.body.classList.remove("print-invitation"), { once: true });
    window.print();
  }
}
