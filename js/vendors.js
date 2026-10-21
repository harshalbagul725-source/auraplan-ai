/**
 * AuraPlan AI - Vendor Checklist & Collaboration Hub
 * Manages vendor lifecycle pipelines, contracts, vetting questions, and payments
 */

class VendorManager {
  constructor(app) {
    this.app = app;
    this.catFilter = "all";
    this.statusFilter = "all";
  }

  getCurrentEvent() {
    return this.app.currentEvent;
  }

  formatCurrency(amount) {
    return this.app.budgetManager.formatCurrency(amount);
  }

  render() {
    const container = document.getElementById("vendors-tab-content");
    if (!container) return;

    const evt = this.getCurrentEvent();
    const vendors = evt.vendors || [];

    const totalContracted = vendors.reduce((sum, v) => sum + Number(v.quote || 0), 0);
    const totalDeposits = vendors.reduce((sum, v) => sum + Number(v.depositPaid || 0), 0);
    const confirmedCount = vendors.filter(v => v.status === "Confirmed" || v.status === "Deposit Paid" || v.status === "Contract Signed").length;

    // Unique categories
    const categories = Array.from(new Set(vendors.map(v => v.category || "General")));

    container.innerHTML = `
      <div class="vendors-dashboard">
        <!-- Top Metrics -->
        <div class="metrics-grid">
          <div class="metric-card glass-card">
            <div class="metric-icon target-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Active Vendors</span>
              <span class="metric-value font-headline">${vendors.length} Partners</span>
              <span class="metric-subtext">${confirmedCount} confirmed / under contract</span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-icon actual-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="6" y2="16"/><line x1="10" y1="16" x2="18" y2="16"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Total Contract Value</span>
              <span class="metric-value font-headline">${this.formatCurrency(totalContracted)}</span>
              <span class="metric-subtext">Committed via proposals & contracts</span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-icon paid-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Secured Deposits</span>
              <span class="metric-value font-headline text-success">${this.formatCurrency(totalDeposits)}</span>
              <span class="metric-subtext">Remaining balance due: <strong>${this.formatCurrency(totalContracted - totalDeposits)}</strong></span>
            </div>
          </div>
        </div>

        <!-- Vendor Controls & AI Help Bar -->
        <div class="vendor-controls-bar glass-card">
          <div class="vendor-filters-wrap">
            <select id="vendor-filter-cat" class="select-dropdown" aria-label="Filter vendors by category">
              <option value="all">All Vendor Categories</option>
              ${categories.map(c => `<option value="${c}" ${this.catFilter === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
            <select id="vendor-filter-status" class="select-dropdown" aria-label="Filter vendors by pipeline stage">
              <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Pipeline Stages</option>
              <option value="Researching" ${this.statusFilter === 'Researching' ? 'selected' : ''}>Researching</option>
              <option value="Contacted" ${this.statusFilter === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Proposal Received" ${this.statusFilter === 'Proposal Received' ? 'selected' : ''}>Proposal Received</option>
              <option value="Contract Signed" ${this.statusFilter === 'Contract Signed' ? 'selected' : ''}>Contract Signed</option>
              <option value="Deposit Paid" ${this.statusFilter === 'Deposit Paid' ? 'selected' : ''}>Deposit Paid</option>
              <option value="Confirmed" ${this.statusFilter === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            </select>
          </div>

          <div class="vendor-cta-wrap">
            <button class="btn btn-outline btn-sm" id="btn-vendor-ai-vibe">
              <span class="ai-sparkle">✨</span> Vendor Question Suggestions
            </button>
            <button class="btn btn-primary" id="btn-add-vendor">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Add Vendor
            </button>
          </div>
        </div>

        <!-- Vendor Directory Cards Grid -->
        <div class="vendors-grid">
          ${this.renderVendorCards(vendors)}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderVendorCards(vendors) {
    let filtered = vendors.filter(v => {
      const matchCat = this.catFilter === "all" || v.category === this.catFilter;
      const matchStatus = this.statusFilter === "all" || v.status === this.statusFilter;
      return matchCat && matchStatus;
    });

    if (!filtered.length) {
      return `
        <div class="empty-state glass-card col-span-full">
          <p>No vendors found for the selected category/status. Click "+ Add Vendor" to add your first supplier!</p>
        </div>
      `;
    }

    const stages = ["Researching", "Contacted", "Proposal Received", "Contract Signed", "Deposit Paid", "Confirmed"];

    return filtered.map(v => {
      const stageIdx = Math.max(0, stages.indexOf(v.status));
      const isConfirmed = v.status === "Confirmed";

      return `
        <div class="vendor-card glass-card" data-vendor-id="${v.id}">
          <div class="vendor-card-header">
            <div>
              <span class="category-tag-sm">${v.category}</span>
              <h3 class="vendor-name">${v.name}</h3>
            </div>
            <div class="vendor-rating">
              ${'★'.repeat(v.rating || 5)}${'☆'.repeat(5 - (v.rating || 5))}
            </div>
          </div>

          <div class="vendor-pipeline-stepper">
            <div class="stepper-label">
              <span>Status: <strong>${v.status}</strong></span>
              <button class="btn-advance-status" data-action="advance-stage" data-id="${v.id}" title="Advance to next pipeline stage">
                Advance Stage ➔
              </button>
            </div>
            <div class="stepper-track">
              <div class="stepper-progress" style="width: ${((stageIdx + 1) / stages.length) * 100}%"></div>
            </div>
          </div>

          <div class="vendor-contact-details">
            ${v.contactName ? `
              <div class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>${v.contactName}</span>
              </div>
            ` : ''}
            ${v.phone ? `
              <div class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:${v.phone}">${v.phone}</a>
              </div>
            ` : ''}
            ${v.email ? `
              <div class="contact-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:${v.email}">${v.email}</a>
              </div>
            ` : ''}
          </div>

          <div class="vendor-financial-summary">
            <div class="vfin-item">
              <span class="vfin-label">Quote Value</span>
              <span class="vfin-val">${this.formatCurrency(v.quote)}</span>
            </div>
            <div class="vfin-item">
              <span class="vfin-label">Deposit Paid</span>
              <span class="vfin-val text-success">${this.formatCurrency(v.depositPaid)}</span>
            </div>
            <div class="vfin-item">
              <span class="vfin-label">Remaining</span>
              <span class="vfin-val">${this.formatCurrency(v.quote - v.depositPaid)}</span>
            </div>
          </div>

          ${v.notes ? `
            <div class="vendor-notes">
              <span class="notes-tag">Internal Note:</span> ${v.notes}
            </div>
          ` : ''}

          <div class="vendor-card-footer">
            <button class="btn-text-action" data-action="ask-ai-vendor" data-cat="${v.category}">
              <span class="ai-sparkle">✨</span> Questions to Ask
            </button>
            <button class="btn-icon text-danger" data-action="delete-vendor" data-id="${v.id}" title="Remove Vendor">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  attachEvents() {
    const catSelect = document.getElementById("vendor-filter-cat");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.catFilter = e.target.value;
        this.render();
      });
    }

    const statusSelect = document.getElementById("vendor-filter-status");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        this.statusFilter = e.target.value;
        this.render();
      });
    }

    const btnAdd = document.getElementById("btn-add-vendor");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => this.openAddVendorModal());
    }

    const btnAI = document.getElementById("btn-vendor-ai-vibe");
    if (btnAI) {
      btnAI.addEventListener("click", () => {
        const evt = this.getCurrentEvent();
        this.app.switchTab("ai");
        this.app.sendAIPrompt(`Give me the top 5 essential contract questions and negotiation tactics for vendors in a ${evt.type} event.`);
      });
    }

    // Delegated actions inside vendor cards
    const grid = document.querySelector(".vendors-grid");
    if (grid) {
      grid.addEventListener("click", (e) => {
        const advBtn = e.target.closest("[data-action='advance-stage']");
        if (advBtn) {
          this.advanceVendorStage(advBtn.dataset.id);
          return;
        }

        const deleteBtn = e.target.closest("[data-action='delete-vendor']");
        if (deleteBtn) {
          this.deleteVendor(deleteBtn.dataset.id);
          return;
        }

        const aiBtn = e.target.closest("[data-action='ask-ai-vendor']");
        if (aiBtn) {
          const cat = aiBtn.dataset.cat || "general";
          this.app.switchTab("ai");
          this.app.sendAIPrompt(`What are the most critical contract clauses and questions to ask a ${cat} vendor before signing?`);
          return;
        }
      });
    }
  }

  advanceVendorStage(id) {
    const evt = this.getCurrentEvent();
    const vendor = evt.vendors.find(v => v.id === id);
    if (!vendor) return;

    const stages = ["Researching", "Contacted", "Proposal Received", "Contract Signed", "Deposit Paid", "Confirmed"];
    const curIdx = stages.indexOf(vendor.status);
    if (curIdx < stages.length - 1) {
      vendor.status = stages[curIdx + 1];
      this.app.saveCurrentEvent();
      this.render();
      this.app.showToast(`${vendor.name} advanced to "${vendor.status}"`, "success");
    } else {
      this.app.showToast(`${vendor.name} is already Confirmed!`, "info");
    }
  }

  deleteVendor(id) {
    const evt = this.getCurrentEvent();
    const idx = evt.vendors.findIndex(v => v.id === id);
    if (idx === -1) return;

    const [deleted] = evt.vendors.splice(idx, 1);
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Removed vendor "${deleted.name}"`, "info");
  }

  openAddVendorModal() {
    this.app.showModal({
      title: "Add Vendor / Supplier",
      content: `
        <form id="add-vendor-form" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Company / Vendor Name *</label>
              <input type="text" name="name" required placeholder="e.g. Apex Cinematic Studios" class="form-input" />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select name="category" class="form-input">
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography & Video</option>
                <option value="Music">DJ / Band / Music</option>
                <option value="Decor & Florals">Decor & Florals</option>
                <option value="Audio/Visual">Audio / Visual & Lighting</option>
                <option value="Rentals">Furniture & Rentals</option>
                <option value="Sanitation">Sanitation & Logistics</option>
                <option value="Permits & Safety">Permits & Safety</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Primary Contact Name</label>
              <input type="text" name="contactName" placeholder="e.g. Claire Dawson" class="form-input" />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="contact@apexcinematic.com" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+1 (555) 019-2831" class="form-input" />
            </div>
            <div class="form-group">
              <label>Pipeline Stage</label>
              <select name="status" class="form-input">
                <option value="Researching">Researching</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Received">Proposal Received</option>
                <option value="Contract Signed">Contract Signed</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Quote / Contract Amount</label>
              <input type="number" name="quote" step="50" placeholder="3500" class="form-input" />
            </div>
            <div class="form-group">
              <label>Deposit Paid</label>
              <input type="number" name="depositPaid" step="50" placeholder="1000" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Important Notes / Clauses</label>
            <textarea name="notes" rows="2" placeholder="e.g. Needs loading dock access at 10 AM, includes drone permit" class="form-input"></textarea>
          </div>
        </form>
      `,
      confirmText: "Save Vendor",
      onConfirm: () => {
        const form = document.getElementById("add-vendor-form");
        if (!form) return;
        const formData = new FormData(form);
        const name = formData.get("name");
        const category = formData.get("category");
        const contactName = formData.get("contactName");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const status = formData.get("status");
        const quote = Number(formData.get("quote") || 0);
        const depositPaid = Number(formData.get("depositPaid") || 0);
        const notes = formData.get("notes");

        if (!name) {
          this.app.showToast("Please provide company name", "warning");
          return false;
        }

        const evt = this.getCurrentEvent();
        evt.vendors.push({
          id: `v-${Date.now()}`,
          name, category, contactName, email, phone, status, quote, depositPaid, notes, rating: 5
        });

        this.app.saveCurrentEvent();
        this.render();
        this.app.showToast(`Vendor "${name}" saved`, "success");
        return true;
      }
    });
  }
}
