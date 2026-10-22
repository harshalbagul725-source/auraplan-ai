/**
 * AuraPlan AI - Budget & Expense Module
 * Interactive spend analytics, dynamic SVG donut chart, expense CRUD, and smart auto-allocator
 */

class BudgetManager {
  constructor(app) {
    this.app = app;
    this.searchQuery = "";
    this.categoryFilter = "all";
    this.statusFilter = "all";
  }

  getCurrentEvent() {
    return this.app.currentEvent;
  }

  formatCurrency(amount) {
    const symbolMap = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "CA$",
      AUD: "AU$",
      INR: "₹"
    };
    const evt = this.getCurrentEvent();
    const sym = symbolMap[evt.currency] || "$";
    const numericAmount = Number(amount);
    const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
    return `${sym}${safeAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  getCalculations() {
    return AuraPlanCore.calculateBudget(this.getCurrentEvent());
  }

  render() {
    const container = document.getElementById("budget-tab-content");
    if (!container) return;

    const calc = this.getCalculations();
    const evt = this.getCurrentEvent();

    container.innerHTML = `
      <div class="budget-dashboard">
        <!-- Top Executive Metrics -->
        <div class="metrics-grid">
          <div class="metric-card glass-card">
            <div class="metric-icon target-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Target Budget</span>
              <span class="metric-value font-headline">${this.formatCurrency(calc.target)}</span>
              <span class="metric-subtext">Set for ${evt.guestCount} guests (~${this.formatCurrency(calc.target / (evt.guestCount || 1))}/guest)</span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-icon actual-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Committed / Spent</span>
              <span class="metric-value font-headline ${calc.totalActual > calc.target ? 'text-danger' : 'text-primary'}">${this.formatCurrency(calc.totalActual)}</span>
              <span class="metric-subtext">${calc.spentPercent}% of total cap utilized</span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-icon paid-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Deposits Paid</span>
              <span class="metric-value font-headline text-success">${this.formatCurrency(calc.totalPaid)}</span>
              <span class="metric-subtext">Balance pending: <strong>${this.formatCurrency(calc.balanceDue)}</strong></span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-icon cushion-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="metric-info">
              <span class="metric-label">Remaining Cushion</span>
              <span class="metric-value font-headline ${calc.remainingCushion < 0 ? 'text-danger' : 'text-accent'}">
                ${calc.remainingCushion < 0 ? '-' : ''}${this.formatCurrency(Math.abs(calc.remainingCushion))}
              </span>
              <span class="metric-subtext">${calc.remainingCushion >= 0 ? 'Available surplus buffer' : '⚠️ Over planned budget!'}</span>
            </div>
          </div>
        </div>

        <!-- Budget Visual Analytics & Auto Allocator Banner -->
        <div class="budget-analytics-row">
          <div class="chart-card glass-card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Category Spend Breakdown</h3>
                <p class="card-subtitle">Visual distribution across event categories</p>
              </div>
              <button class="btn btn-outline btn-sm" id="btn-open-allocator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                Budget Suggestions
              </button>
            </div>
            <div class="chart-body">
              <div class="donut-chart-wrapper" id="donut-chart-container">
                ${this.renderDonutChart(calc)}
              </div>
              <div class="category-legend" id="category-legend-container">
                ${this.renderCategoryLegend(calc)}
              </div>
            </div>
          </div>

          <!-- AI Optimization Suggestion Card -->
          <div class="ai-budget-card glass-card">
            <div class="ai-budget-header">
              <div class="ai-badge">
                <span class="ai-sparkle">✨</span>
                <span>AuraPlan Budget Snapshot</span>
              </div>
              <button class="btn btn-sm btn-ghost" id="btn-refresh-budget-ai" title="Refresh budget summary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </button>
            </div>
            <div class="ai-budget-content">
              <h4>${calc.remainingCushion >= 0 ? 'Optimal Allocation Status' : 'Over-Budget Alert Detected'}</h4>
              <p class="ai-budget-text">
                ${calc.remainingCushion >= 0
                  ? `Your budget has a healthy <strong>${this.formatCurrency(calc.remainingCushion)}</strong> safety cushion (${calc.target > 0 ? Math.round((calc.remainingCushion / calc.target) * 100) : 0}%). Your top expense is <em>${AuraPlanCore.escapeHTML(this.getTopCategory(calc.byCategory))}</em>.`
                  : `You are currently exceeding your target budget by <strong>${this.formatCurrency(Math.abs(calc.remainingCushion))}</strong>. Consider shifting floral decor to seasonal locally-sourced greenery or trimming print stationery.`
                }
              </p>
              <div class="ai-action-chips">
                <button class="chip-btn" data-ai-query="Suggest 3 cost-saving strategies for my ${AuraPlanCore.escapeHTML(evt.type)} budget">
                  💡 3 Instant Savings Strategies
                </button>
                <button class="chip-btn" data-ai-query="What is a good tipping protocol for wedding and event vendors?">
                  💵 Vendor Tipping Guide
                </button>
                <button class="chip-btn" data-ai-query="How can I negotiate bar minimums without hurting guest experience?">
                  🍸 Bar Minimum Negotiation
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Expense Line Items & Actions -->
        <div class="expenses-section glass-card">
          <div class="expenses-header">
            <div class="expenses-title-wrap">
              <h3 class="card-title">Expense Line Items & Invoices</h3>
              <span class="badge badge-neutral">${evt.expenses.length} Items</span>
            </div>
            <div class="expenses-controls">
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" id="expense-search" placeholder="Search item, vendor..." value="${AuraPlanCore.escapeHTML(this.searchQuery)}" />
              </div>
              <select id="expense-filter-cat" class="select-dropdown" aria-label="Filter expenses by category">
                <option value="all">All Categories</option>
                ${Object.keys(calc.byCategory).map(cat => `
                  <option value="${AuraPlanCore.escapeHTML(cat)}" ${this.categoryFilter === cat ? 'selected' : ''}>${AuraPlanCore.escapeHTML(cat)}</option>
                `).join('')}
              </select>
              <select id="expense-filter-status" class="select-dropdown" aria-label="Filter expenses by payment status">
                <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
                <option value="Paid" ${this.statusFilter === 'Paid' ? 'selected' : ''}>Paid in Full</option>
                <option value="Deposit Paid" ${this.statusFilter === 'Deposit Paid' ? 'selected' : ''}>Deposit Paid</option>
                <option value="Pending" ${this.statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
              </select>
              <button class="btn btn-primary" id="btn-add-expense">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                + Add Expense
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Item / Service</th>
                  <th>Vendor</th>
                  <th>Estimated</th>
                  <th>Actual</th>
                  <th>Paid</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderExpenseRows(evt.expenses)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  getTopCategory(byCategory) {
    let top = "Venue";
    let max = 0;
    for (const [k, v] of Object.entries(byCategory)) {
      if (v.actual > max) {
        max = v.actual;
        top = k;
      }
    }
    return top;
  }

  renderDonutChart(calc) {
    const categories = Object.entries(calc.byCategory);
    if (!categories.length || calc.totalActual <= 0) {
      return `<div class="chart-empty">No expenses logged yet.</div>`;
    }

    const colors = [
      "#10B981", "#6366F1", "#F59E0B", "#EC4899", 
      "#3B82F6", "#8B5CF6", "#14B8A6", "#F97316"
    ];

    const size = 180;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;
    const slices = categories.map(([cat, data], idx) => {
      const pct = data.actual / calc.totalActual;
      const strokeDash = pct * circumference;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += strokeDash;
      const color = colors[idx % colors.length];

      return `
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="none"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDash} ${circumference - strokeDash}"
          stroke-dashoffset="${strokeDashoffset}"
          class="donut-segment"
          data-cat="${AuraPlanCore.escapeHTML(cat)}"
          data-amount="${this.formatCurrency(data.actual)}"
          data-pct="${Math.round(pct * 100)}%"
        />
      `;
    }).join("");

    return `
      <div class="donut-svg-container">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}" />
          ${slices}
        </svg>
        <div class="donut-center-label">
          <span class="donut-center-title">Total</span>
          <span class="donut-center-value">${this.formatCurrency(calc.totalActual)}</span>
        </div>
      </div>
    `;
  }

  renderCategoryLegend(calc) {
    const categories = Object.entries(calc.byCategory);
    const colors = [
      "#10B981", "#6366F1", "#F59E0B", "#EC4899", 
      "#3B82F6", "#8B5CF6", "#14B8A6", "#F97316"
    ];

    return categories.map(([cat, data], idx) => {
      const pct = calc.totalActual > 0 ? Math.round((data.actual / calc.totalActual) * 100) : 0;
      const color = colors[idx % colors.length];
      return `
        <div class="legend-row">
          <div class="legend-info">
            <span class="legend-dot" style="background-color: ${color}"></span>
            <span class="legend-name">${AuraPlanCore.escapeHTML(cat)}</span>
          </div>
          <div class="legend-numbers">
            <span class="legend-amount">${this.formatCurrency(data.actual)}</span>
            <span class="legend-pct">${pct}%</span>
          </div>
        </div>
      `;
    }).join("");
  }

  renderExpenseRows(expenses) {
    let filtered = expenses.filter(exp => {
      const name = String(exp.name || "");
      const vendor = String(exp.vendor || "");
      const category = String(exp.category || "General");
      const matchSearch = !this.searchQuery || 
        name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        vendor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchCat = this.categoryFilter === "all" || category === this.categoryFilter;
      const matchStatus = this.statusFilter === "all" || exp.status === this.statusFilter;

      return matchSearch && matchCat && matchStatus;
    });

    if (filtered.length === 0) {
      return `
        <tr>
          <td colspan="9" class="empty-state-cell">
            <div class="table-empty">
              <span>No expense records match your active search/filter.</span>
            </div>
          </td>
        </tr>
      `;
    }

    return filtered.map(item => {
      const statusBadgeClass = 
        item.status === "Paid" ? "badge-success" :
        item.status === "Deposit Paid" ? "badge-info" :
        item.status === "Overdue" ? "badge-danger" : "badge-warning";

      return `
        <tr data-expense-id="${AuraPlanCore.escapeHTML(item.id)}">
          <td><span class="category-tag">${AuraPlanCore.escapeHTML(item.category || "General")}</span></td>
          <td class="font-medium">${AuraPlanCore.escapeHTML(item.name || "Expense")}</td>
          <td class="text-secondary">${AuraPlanCore.escapeHTML(item.vendor || '—')}</td>
          <td class="text-secondary">${this.formatCurrency(item.estimated)}</td>
          <td class="font-semibold">${this.formatCurrency(item.actual ?? item.estimated)}</td>
          <td class="text-success">${this.formatCurrency(item.paid)}</td>
          <td class="text-secondary">${AuraPlanCore.escapeHTML(item.due || 'TBD')}</td>
          <td><span class="badge ${statusBadgeClass}">${AuraPlanCore.escapeHTML(item.status || "Pending")}</span></td>
          <td class="text-right table-actions">
            <button class="btn-icon" data-action="toggle-paid" data-id="${AuraPlanCore.escapeHTML(item.id)}" title="Toggle Paid Status">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
            <button class="btn-icon text-danger" data-action="delete-expense" data-id="${AuraPlanCore.escapeHTML(item.id)}" title="Delete Expense">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  attachEvents() {
    const searchInput = document.getElementById("expense-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderTableOnly();
      });
    }

    const catSelect = document.getElementById("expense-filter-cat");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.categoryFilter = e.target.value;
        this.renderTableOnly();
      });
    }

    const statusSelect = document.getElementById("expense-filter-status");
    if (statusSelect) {
      statusSelect.addEventListener("change", (e) => {
        this.statusFilter = e.target.value;
        this.renderTableOnly();
      });
    }

    const btnAdd = document.getElementById("btn-add-expense");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => this.openAddExpenseModal());
    }

    const btnAllocator = document.getElementById("btn-open-allocator");
    if (btnAllocator) {
      btnAllocator.addEventListener("click", () => this.openAllocatorModal());
    }

    // AI prompt chips
    document.querySelectorAll(".ai-action-chips .chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.dataset.aiQuery;
        if (query) {
          this.app.switchTab("ai");
          this.app.sendAIPrompt(query);
        }
      });
    });

    // Delegated table actions
    const table = document.querySelector(".data-table");
    if (table) {
      table.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === "toggle-paid") {
          this.toggleExpensePaid(id);
        } else if (action === "delete-expense") {
          this.deleteExpense(id);
        }
      });
    }
  }

  renderTableOnly() {
    const tbody = document.querySelector(".data-table tbody");
    if (tbody) {
      tbody.innerHTML = this.renderExpenseRows(this.getCurrentEvent().expenses);
    }
  }

  toggleExpensePaid(id) {
    const evt = this.getCurrentEvent();
    const item = evt.expenses.find(x => x.id === id);
    if (!item) return;

    if (item.status === "Paid") {
      item.status = "Pending";
      item.paid = 0;
    } else {
      item.status = "Paid";
      item.paid = item.actual ?? item.estimated;
    }

    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Updated "${item.name}" to ${item.status}`, "success");
  }

  deleteExpense(id) {
    const evt = this.getCurrentEvent();
    const idx = evt.expenses.findIndex(x => x.id === id);
    if (idx === -1) return;

    const [deleted] = evt.expenses.splice(idx, 1);
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Removed "${deleted.name}"`, "info");
  }

  addExpenseItem(item) {
    const evt = this.getCurrentEvent();
    const validation = AuraPlanCore.validateExpense(item);
    if (!validation.valid) {
      this.app.showToast(validation.errors.join(" "), "warning");
      return false;
    }

    const expense = validation.expense;
    evt.expenses.push({
      id: `exp-${Date.now()}`,
      ...expense
    });
    this.app.saveCurrentEvent();
    this.render();
    return true;
  }

  openAddExpenseModal() {
    const evt = this.getCurrentEvent();
    const existingCats = Object.keys(this.getCalculations().byCategory);
    const defaultCats = [
      "Venue & Rentals", "Catering & Bar", "Photography & Video", 
      "Music & Entertainment", "Decor & Florals", "Attire & Beauty", 
      "Permits & Logistics", "Favors & Stationery", "Contingency"
    ];
    const allCats = Array.from(new Set([...existingCats, ...defaultCats]));

    this.app.showModal({
      title: "Add New Expense",
      content: `
        <form id="add-expense-form" class="modal-form">
          <div class="form-group">
            <label>Item or Service Name *</label>
            <input type="text" name="name" required placeholder="e.g. Cocktail Hour Oyster Shucker" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category *</label>
              <select name="category" class="form-input" required>
                ${allCats.map(c => `<option value="${AuraPlanCore.escapeHTML(c)}">${AuraPlanCore.escapeHTML(c)}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label>Vendor / Supplier</label>
              <input type="text" name="vendor" placeholder="e.g. Coastal Oyster Bar Co." class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Estimated Amount (${AuraPlanCore.escapeHTML(evt.currency)}) *</label>
              <input type="number" name="estimated" min="0" step="any" required placeholder="1200" class="form-input" />
            </div>
            <div class="form-group">
              <label>Actual / Contracted (${AuraPlanCore.escapeHTML(evt.currency)})</label>
              <input type="number" name="actual" min="0" step="any" placeholder="Optional" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Deposit Paid (${AuraPlanCore.escapeHTML(evt.currency)})</label>
              <input type="number" name="paid" min="0" step="any" value="0" class="form-input" />
            </div>
            <div class="form-group">
              <label>Payment Due Date</label>
              <input type="date" name="due" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Payment Status</label>
            <select name="status" class="form-input">
              <option value="Pending">Pending</option>
              <option value="Deposit Paid">Deposit Paid</option>
              <option value="Paid">Paid in Full</option>
            </select>
          </div>
        </form>
      `,
      confirmText: "Save Expense",
      onConfirm: () => {
        const form = document.getElementById("add-expense-form");
        if (!form || !form.reportValidity()) return false;
        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const category = formData.get("category");
        const estimated = Number(formData.get("estimated") || 0);
        const actualValue = formData.get("actual");
        const actual = actualValue === "" ? estimated : Number(actualValue);
        const paid = Number(formData.get("paid") || 0);
        const due = formData.get("due");
        const vendor = formData.get("vendor");
        const status = formData.get("status");

        const added = this.addExpenseItem({
          name, category, estimated, actual, paid, due, vendor, status
        });
        if (!added) return false;
        this.app.showToast(`Added "${name}" to budget`, "success");
        return true;
      }
    });
  }

  openAllocatorModal() {
    const evt = this.getCurrentEvent();
    const benchmarks = BENCHMARK_TEMPLATES[evt.type] || BENCHMARK_TEMPLATES.wedding;
    const currentTarget = evt.targetBudget;

    const rows = benchmarks.map(b => {
      const allocated = Math.round((currentTarget * b.pct) / 100);
      return `
        <div class="allocator-row">
          <div class="allocator-cat">
            <strong>${AuraPlanCore.escapeHTML(b.name)}</strong>
            <span class="text-secondary text-sm">Illustrative allocation: ${b.pct}%</span>
          </div>
          <div class="allocator-calc">
            <span class="font-headline font-semibold">${this.formatCurrency(allocated)}</span>
          </div>
        </div>
      `;
    }).join("");

    this.app.showModal({
      title: "Illustrative Budget Allocator",
      content: `
        <div class="allocator-modal-content">
          <p class="text-secondary text-sm">
            A starting-point split for a <strong>${AuraPlanCore.escapeHTML(evt.type)}</strong> with <strong>${Number(evt.guestCount) || 0} guests</strong>.
            These illustrative percentages are not verified market data. Adjust the target to fit your own quotes and priorities:
          </p>
          <div class="allocator-list">
            ${rows}
          </div>
          <div class="allocator-adjust-target">
            <label class="form-label">Adjust Overall Target Cap:</label>
            <div class="input-with-button">
              <input type="number" id="allocator-target-input" min="0" value="${currentTarget}" class="form-input" step="any" />
            </div>
          </div>
        </div>
      `,
      confirmText: "Apply Target Budget",
      onConfirm: () => {
        const input = document.getElementById("allocator-target-input");
        if (!input || !input.reportValidity()) return false;
        const target = Number(input.value);
        if (!Number.isFinite(target) || target < 0) {
          this.app.showToast("Enter a valid non-negative target budget.", "warning");
          return false;
        }
        evt.targetBudget = target;
        this.app.saveCurrentEvent();
        this.render();
        this.app.showToast(`Target budget set to ${this.formatCurrency(evt.targetBudget)}`, "success");
        return true;
      }
    });
  }
}
