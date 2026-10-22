/**
 * AuraPlan AI - Main Application Controller
 * Manages event switching, tab navigation, global AI chat co-pilot, and print view
 */

class AuraApp {
  constructor() {
    this.events = this.loadEvents();
    this.currentEventId = localStorage.getItem("auraplan_active_event") || this.events[0].id;
    this.currentEvent = this.events.find(e => e.id === this.currentEventId) || this.events[0];
    this.activeTab = "ai";
    this.chatHistory = {}; // eventId -> [{ role, text }]

    // Instantiate sub-managers
    this.budgetManager = new BudgetManager(this);
    this.timelineManager = new TimelineManager(this);
    this.vendorManager = new VendorManager(this);
    this.ideasManager = new IdeasManager(this);
    this.plannerManager = new PlannerManager(this);
    this.guestManager = new GuestManager(this);
    this.invitationManager = new InvitationManager(this);

    this.init();
  }

  loadEvents() {
    try {
      const saved = localStorage.getItem("auraplan_events");
      if (!saved) return JSON.parse(JSON.stringify(DEFAULT_EVENTS));

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        throw new TypeError("Saved event data must be an array.");
      }

      const recordSections = [
        "budgetCategories",
        "colorPalette",
        "expenses",
        "guests",
        "milestones",
        "personalizedIdeas",
        "runOfShow",
        "vendors"
      ];
      const supportedTypes = new Set(["wedding", "birthday", "community"]);
      const events = parsed
        .filter(event => event && typeof event === "object" && !Array.isArray(event) &&
          typeof event.id === "string" && typeof event.title === "string")
        .map(event => {
          const normalized = {
            ...event,
            type: supportedTypes.has(event.type) ? event.type : "community",
            title: event.title.trim() || "Untitled event",
            date: String(event.date || ""),
            time: String(event.time || ""),
            location: String(event.location || ""),
            guestCount: Number.isInteger(Number(event.guestCount)) && Number(event.guestCount) > 0
              ? Number(event.guestCount)
              : 0,
            targetBudget: Number.isFinite(Number(event.targetBudget)) && Number(event.targetBudget) >= 0
              ? Number(event.targetBudget)
              : 0,
            currency: String(event.currency || "USD"),
            aiPrompts: Array.isArray(event.aiPrompts)
              ? event.aiPrompts.filter(prompt => typeof prompt === "string")
              : []
          };
          recordSections.forEach(section => {
            normalized[section] = Array.isArray(event[section])
              ? event[section].filter(item => item && typeof item === "object" && !Array.isArray(item))
              : [];
          });
          return normalized;
        });

      if (!events.length) {
        throw new TypeError("Saved event data does not contain any valid event records.");
      }
      if (events.length !== parsed.length) {
        console.warn("Some invalid saved event records were ignored.");
      }
      return events;
    } catch (error) {
      console.error("Failed to load saved events; using default templates.", error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_EVENTS));
  }

  saveEvents() {
    try {
      localStorage.setItem("auraplan_events", JSON.stringify(this.events));
    } catch (error) {
      console.error("Failed to save event data.", error);
      this.showToast("Event data could not be saved. Check browser storage availability and free space.", "danger");
      throw error;
    }
  }

  saveCurrentEvent() {
    const idx = this.events.findIndex(e => e.id === this.currentEvent.id);
    if (idx !== -1) {
      this.events[idx] = this.currentEvent;
    }
    this.saveEvents();
    this.renderHeaderDetails();
  }

  init() {
    this.setupTheme();
    this.renderHeaderDetails();
    this.renderEventSelector();
    this.attachGlobalEvents();
    this.switchTab("ai");
    this.startCountdownTimer();
  }

  setupTheme() {
    const savedTheme = localStorage.getItem("auraplan_theme") || "dark";
    if (savedTheme === "light") {
      document.documentElement.classList.add("theme-light");
    } else {
      document.documentElement.classList.remove("theme-light");
    }
  }

  toggleTheme() {
    const isLight = document.documentElement.classList.toggle("theme-light");
    localStorage.setItem("auraplan_theme", isLight ? "light" : "dark");
    this.showToast(`Switched to ${isLight ? 'Light' : 'Dark'} luxury theme`, "info");
  }

  renderHeaderDetails() {
    const evt = this.currentEvent;
    
    // Title & badge
    const headerTitle = document.getElementById("header-event-title");
    const headerType = document.getElementById("header-event-type");
    const headerMeta = document.getElementById("header-event-meta");
    
    if (headerTitle) headerTitle.textContent = evt.title;
    if (headerType) headerType.textContent = evt.type.toUpperCase();
    if (headerMeta) {
      headerMeta.textContent = `${evt.date} • ${evt.location} • ${evt.guestCount} Guests`;
    }

    // Top KPI metrics in header
    const budget = this.budgetManager.getCalculations();

    const budgetKpi = document.getElementById("kpi-budget-progress");
    if (budgetKpi) {
      budgetKpi.textContent = `${this.budgetManager.formatCurrency(budget.totalActual)} / ${this.budgetManager.formatCurrency(budget.target)} (${budget.spentPercent}%)`;
    }

    const vendorsKpi = document.getElementById("kpi-vendors-count");
    if (vendorsKpi) {
      const confirmed = (evt.vendors || []).filter(v => v.status === "Confirmed" || v.status === "Deposit Paid").length;
      vendorsKpi.textContent = `${confirmed} of ${evt.vendors?.length || 0} confirmed`;
    }
  }

  renderEventSelector() {
    const selector = document.getElementById("event-switcher-select");
    if (!selector) return;

    selector.innerHTML = `
      ${this.events.map(e => `
        <option value="${AuraPlanCore.escapeHTML(e.id)}" ${e.id === this.currentEvent.id ? 'selected' : ''}>
          ${e.type === 'wedding' ? '💍' : e.type === 'birthday' ? '🎂' : '🎪'} ${AuraPlanCore.escapeHTML(e.title)}
        </option>
      `).join('')}
      <option value="__NEW__">+ Create New Event...</option>
    `;

    selector.onchange = (e) => {
      const val = e.target.value;
      if (val === "__NEW__") {
        this.openCreateEventModal();
        selector.value = this.currentEvent.id;
      } else {
        this.switchEvent(val);
      }
    };
  }

  switchEvent(id) {
    const found = this.events.find(e => e.id === id);
    if (!found) return;

    this.currentEvent = found;
    this.currentEventId = id;
    localStorage.setItem("auraplan_active_event", id);

    this.renderHeaderDetails();
    this.renderEventSelector();
    this.refreshCurrentTab();
    this.showToast(`Switched to "${found.title}"`, "info");
  }

  startCountdownTimer() {
    const updateCountdown = () => {
      const el = document.getElementById("countdown-display");
      if (!el) return;

      const evtDate = new Date(`${this.currentEvent.date}T${this.currentEvent.time || '12:00'}:00`);
      const now = new Date();
      const diff = evtDate - now;

      if (diff <= 0) {
        el.innerHTML = `<span class="countdown-tag countdown-active">🎉 Event Today!</span>`;
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      el.innerHTML = `
        <div class="countdown-units">
          <span class="count-block"><strong>${days}</strong>d</span>
          <span class="count-block"><strong>${hours}</strong>h</span>
          <span class="count-block"><strong>${minutes}</strong>m</span>
        </div>
      `;
    };

    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    document.querySelectorAll(".nav-tab-item").forEach(item => {
      const isSelected = item.dataset.tab === tabId;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    document.querySelectorAll(".tab-pane").forEach(pane => {
      const isActive = pane.id === `tab-${tabId}`;
      pane.classList.toggle("active", isActive);
      pane.setAttribute("aria-hidden", String(!isActive));
    });

    this.refreshCurrentTab();
  }

  refreshCurrentTab() {
    switch (this.activeTab) {
      case "ai":
        this.renderAIChatView();
        break;
      case "dashboard":
        this.renderDashboard();
        break;
      case "budget":
        this.budgetManager.render();
        break;
      case "timeline":
        this.timelineManager.render();
        break;
      case "vendors":
        this.vendorManager.render();
        break;
      case "ideas":
        this.ideasManager.render();
        break;
      case "itinerary":
        this.renderMasterItinerary();
        break;
      case "planner":
        this.plannerManager.render();
        break;
      case "guests":
        this.guestManager.render();
        break;
      case "invitation":
        this.invitationManager.render();
        break;
    }
  }

  renderDashboard() {
    const container = document.getElementById("dashboard-tab-content");
    if (!container) return;

    const event = this.currentEvent;
    const summary = AuraPlanCore.summarizeDashboard(event);
    const tasks = summary.tasks;
    const vendorChecklist = summary.vendorChecklist;

    container.innerHTML = `
      <div class="overview-dashboard">
        <section class="overview-intro glass-card">
          <div>
            <span class="badge badge-info">EVENT OVERVIEW</span>
            <h2 class="card-title">${AuraPlanCore.escapeHTML(event.title)}</h2>
            <p class="card-subtitle">${AuraPlanCore.escapeHTML([event.type, event.date, event.location, `${event.guestCount} guests`].filter(Boolean).join(" · "))}</p>
          </div>
          <button class="btn btn-primary" type="button" data-dashboard-tab="planner">Review event plan</button>
        </section>

        <section class="metrics-grid overview-metrics" aria-label="Event summary">
          <article class="metric-card glass-card">
            <span class="metric-label">Target budget</span>
            <strong class="metric-value">${this.budgetManager.formatCurrency(summary.budget.target)}</strong>
            <span class="metric-subtext">Estimated and actual expenses tracked</span>
          </article>
          <article class="metric-card glass-card">
            <span class="metric-label">Remaining balance</span>
            <strong class="metric-value ${summary.budget.remainingCushion < 0 ? "text-danger" : "text-success"}">${this.budgetManager.formatCurrency(summary.budget.remainingCushion)}</strong>
            <span class="metric-subtext">${this.budgetManager.formatCurrency(summary.budget.totalActual)} committed / spent</span>
          </article>
          <article class="metric-card glass-card">
            <span class="metric-label">Checklist progress</span>
            <strong class="metric-value">${tasks.completed} / ${tasks.total}</strong>
            <span class="metric-subtext">${tasks.percentComplete}% of timeline tasks complete${tasks.overdue ? ` · ${tasks.overdue} overdue` : ""}</span>
          </article>
          <article class="metric-card glass-card">
            <span class="metric-label">Vendor coverage</span>
            <strong class="metric-value">${vendorChecklist.covered} / ${vendorChecklist.total}</strong>
            <span class="metric-subtext">${vendorChecklist.confirmed} fully confirmed</span>
          </article>
        </section>

        <div class="overview-content-grid">
          <section class="glass-card overview-panel">
            <div class="overview-panel-heading">
              <div>
                <h3 class="card-title">Upcoming tasks</h3>
                <p class="card-subtitle">The next dated items from your event timeline</p>
              </div>
              <button class="btn btn-outline btn-sm" type="button" data-dashboard-tab="timeline">Open timeline</button>
            </div>
            ${tasks.upcoming.length ? `
              <ul class="overview-task-list">
                ${tasks.upcoming.map(task => `
                  <li>
                    <span class="overview-task-date">${AuraPlanCore.escapeHTML(task.dueDate)}</span>
                    <span class="overview-task-title">${AuraPlanCore.escapeHTML(task.title)}</span>
                    <span class="badge ${task.status === "in-progress" ? "badge-info" : "badge-neutral"}">${AuraPlanCore.escapeHTML(task.status || "todo")}</span>
                  </li>
                `).join("")}
              </ul>
            ` : `<p class="text-secondary">${tasks.overdue ? `${tasks.overdue} overdue task${tasks.overdue === 1 ? "" : "s"} need attention. ` : ""}No upcoming dated tasks. Add deadlines in Timeline.</p>`}
          </section>

          <section class="glass-card overview-panel">
            <div class="overview-panel-heading">
              <div>
                <h3 class="card-title">Vendor checklist</h3>
                <p class="card-subtitle">${vendorChecklist.covered} of ${vendorChecklist.total} categories have a vendor record</p>
              </div>
              <button class="btn btn-outline btn-sm" type="button" data-dashboard-tab="vendors">Manage vendors</button>
            </div>
            <ul class="overview-vendor-list">
              ${vendorChecklist.items.map(item => `
                <li>
                  <span class="overview-check ${item.covered ? "is-covered" : ""}" aria-hidden="true">${item.covered ? "✓" : "○"}</span>
                  <span>${AuraPlanCore.escapeHTML(item.category)}</span>
                  <span class="text-secondary">${AuraPlanCore.escapeHTML(item.status || "Not added")}</span>
                </li>
              `).join("")}
            </ul>
          </section>
        </div>

        <div class="overview-shortcuts" aria-label="Planning shortcuts">
          <button class="btn btn-outline" type="button" data-dashboard-tab="budget">Review budget</button>
          <button class="btn btn-outline" type="button" data-dashboard-tab="ideas">Explore event ideas</button>
          <button class="btn btn-outline" type="button" data-dashboard-tab="ai">Open local planning helper</button>
        </div>
        <p class="overview-disclaimer">Planning data is saved in this browser. The built-in helper uses local demo suggestions; no live GenAI model or vendor-price service is connected.</p>
      </div>
    `;

    container.querySelectorAll("[data-dashboard-tab]").forEach(button => {
      button.addEventListener("click", () => this.switchTab(button.dataset.dashboardTab));
    });
  }

  /**
   * AI Planning Co-Pilot Studio
   */
  renderAIChatView() {
    const container = document.getElementById("ai-tab-content");
    if (!container) return;

    const evt = this.currentEvent;
    if (!this.chatHistory[evt.id]) {
      this.chatHistory[evt.id] = [
        {
          role: "assistant",
          text: `👋 **Welcome to your AuraPlan local planning helper for ${evt.title}!**

Your saved event details:
- **Guests:** ${evt.guestCount}
- **Target Budget:** ${this.budgetManager.formatCurrency(evt.targetBudget)}
- **Theme:** *${evt.theme}*

Ask for planning prompts about vendors, decor, timelines, or your budget. Suggestions are local examples, not live AI responses or vendor quotes.`
        }
      ];
    }

    const messages = this.chatHistory[evt.id];

    container.innerHTML = `
      <div class="ai-studio-container">
        <!-- AI Prompt Quick Launcher Bar -->
        <div class="ai-prompts-shelf glass-card">
          <div class="shelf-header">
            <span class="shelf-label"><span class="ai-sparkle">✨</span> Recommended Planning Prompts for ${AuraPlanCore.escapeHTML(evt.type)}:</span>
          </div>
          <div class="prompt-chips-scroll">
            ${(evt.aiPrompts || []).map(p => `
              <button class="ai-preset-chip" data-prompt="${AuraPlanCore.escapeHTML(p)}">${AuraPlanCore.escapeHTML(p)}</button>
            `).join("")}
          </div>
        </div>

        <!-- Chat Conversation Stream -->
        <div class="ai-chat-window glass-card" id="ai-chat-messages">
          ${messages.map(m => this.renderMessageItem(m)).join("")}
        </div>

        <!-- Chat Input Bar -->
        <div class="ai-input-card glass-card">
          <div class="ai-input-wrapper">
            <textarea id="ai-chat-input" maxlength="1000" placeholder="Ask the local planning helper... (e.g. 'Draft a run-of-show for 140 guests', 'Review my catering estimate', 'Write a funny toast')" rows="2"></textarea>
            <button class="btn btn-primary" id="btn-send-ai-chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span>Ask AuraPlan</span>
            </button>
          </div>
          <div class="ai-input-footer">
            <span class="ai-status-indicator">
              <span class="status-dot sim"></span>
              AuraPlan local demo engine (no live model connected)
            </span>
            <span class="text-secondary text-xs">A server-side AI connection is not configured.</span>
          </div>
        </div>
      </div>
    `;

    this.attachAIChatEvents();
    this.scrollChatToBottom();
  }

  renderMessageItem(m) {
    const isUser = m.role === "user";
    return `
      <div class="chat-message ${isUser ? 'user-message' : 'ai-message'}">
        <div class="message-avatar">
          ${isUser ? '👤' : '✨'}
        </div>
        <div class="message-bubble">
          <div class="message-text">
            ${this.formatMarkdown(m.text)}
          </div>
          ${!isUser ? this.renderActionButtons(m.text) : ''}
        </div>
      </div>
    `;
  }

  renderActionButtons(text) {
    let actionsHtml = "";

    // Parse budget item tag: [BUDGET_ITEM: Category | Item Name | Cost]
    const budgetMatch = text.match(/\[BUDGET_ITEM:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\]/i);
    if (budgetMatch) {
      const cat = budgetMatch[1].trim();
      const name = budgetMatch[2].trim();
      const cost = Number(budgetMatch[3]);
      actionsHtml += `
        <button class="ai-action-btn" data-action="apply-budget" data-cat="${AuraPlanCore.escapeHTML(cat)}" data-name="${AuraPlanCore.escapeHTML(name)}" data-cost="${cost}">
          + Add "${AuraPlanCore.escapeHTML(name)}" ($${cost}) to Budget
        </button>
      `;
    }

    // Parse timeline tag: [TIMELINE_ITEM: Time | Title | Description]
    const timeMatch = text.match(/\[TIMELINE_ITEM:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^\]]+)\]/i);
    if (timeMatch) {
      const time = timeMatch[1].trim();
      const title = timeMatch[2].trim();
      const desc = timeMatch[3].trim();
      actionsHtml += `
        <button class="ai-action-btn" data-action="apply-timeline" data-time="${AuraPlanCore.escapeHTML(time)}" data-title="${AuraPlanCore.escapeHTML(title)}" data-notes="${AuraPlanCore.escapeHTML(desc)}">
          + Add "${AuraPlanCore.escapeHTML(title)}" (${AuraPlanCore.escapeHTML(time)}) to Run-of-Show
        </button>
      `;
    }

    if (!actionsHtml) return "";
    return `<div class="ai-message-actions">${actionsHtml}</div>`;
  }

  attachAIChatEvents() {
    const btnSend = document.getElementById("btn-send-ai-chat");
    const input = document.getElementById("ai-chat-input");

    if (btnSend && input) {
      btnSend.onclick = () => {
        const text = input.value.trim();
        if (text) {
          this.sendAIPrompt(text);
          input.value = "";
        }
      };

      input.onkeydown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          btnSend.click();
        }
      };
    }

    // Preset chips
    document.querySelectorAll(".ai-preset-chip").forEach(chip => {
      chip.onclick = () => {
        const p = chip.dataset.prompt;
        if (p) this.sendAIPrompt(p);
      };
    });

    // Delegated Action Buttons in messages
    const chatWindow = document.getElementById("ai-chat-messages");
    if (chatWindow) {
      chatWindow.addEventListener("click", (e) => {
        const budgetBtn = e.target.closest("[data-action='apply-budget']");
        if (budgetBtn) {
          const { cat, name, cost } = budgetBtn.dataset;
          this.budgetManager.addExpenseItem({
            category: cat,
            name: name,
            estimated: Number(cost),
            status: "Pending"
          });
          this.showToast(`Injected "${name}" into Budget!`, "success");
          budgetBtn.disabled = true;
          budgetBtn.textContent = `✓ Added to Budget`;
          return;
        }

        const timeBtn = e.target.closest("[data-action='apply-timeline']");
        if (timeBtn) {
          const { time, title, notes } = timeBtn.dataset;
          this.timelineManager.addRunOfShowItem({
            time: time,
            title: title,
            notes: notes
          });
          this.showToast(`Injected "${title}" into Run of Show!`, "success");
          timeBtn.disabled = true;
          timeBtn.textContent = `✓ Added to Run of Show`;
          return;
        }
      });
    }
  }

  async sendAIPrompt(promptText) {
    const normalizedPrompt = String(promptText || "").trim();
    if (!normalizedPrompt) return;
    if (normalizedPrompt.length > 1000) {
      this.showToast("Keep planning prompts to 1,000 characters or fewer.", "warning");
      return;
    }

    const evt = this.currentEvent;
    if (!this.chatHistory[evt.id]) {
      this.chatHistory[evt.id] = [];
    }

    // Add user message
    this.chatHistory[evt.id].push({ role: "user", text: normalizedPrompt });
    this.renderAIChatView();

    const chatWindow = document.getElementById("ai-chat-messages");
    if (!chatWindow) return;

    // Placeholder message for streaming
    const aiMsgObj = { role: "assistant", text: "Thinking & synthesizing strategy..." };
    this.chatHistory[evt.id].push(aiMsgObj);

    // Re-render to show thinking
    const lastMsgEl = document.createElement("div");
    lastMsgEl.className = "chat-message ai-message";
    lastMsgEl.innerHTML = `
      <div class="message-avatar">✨</div>
      <div class="message-bubble"><div class="message-text"><em>AuraPlan AI is calculating parameters...</em></div></div>
    `;
    chatWindow.appendChild(lastMsgEl);
    this.scrollChatToBottom();

    // Stream generation
    try {
      aiMsgObj.text = await window.auraAI.ask(normalizedPrompt, evt, chunk => {
        const bubble = lastMsgEl.querySelector(".message-text");
        if (bubble) bubble.innerHTML = this.formatMarkdown(chunk);
        this.scrollChatToBottom();
      });
    } catch (error) {
      console.error("The local planning helper failed to create a response.", error);
      aiMsgObj.text = "The local planning helper could not create a response. Please check your prompt and try again.";
      this.showToast("The planning helper could not create a response.", "danger");
    }
    this.renderAIChatView();
  }

  scrollChatToBottom() {
    const chatWindow = document.getElementById("ai-chat-messages");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }

  formatMarkdown(text) {
    if (!text) return "";
    let clean = AuraPlanCore.escapeHTML(text)
      .replace(/\[BUDGET_ITEM:[^\]]+\]/gi, "")
      .replace(/\[TIMELINE_ITEM:[^\]]+\]/gi, "")
      .replace(/### (.*?)\n/g, '<h4 class="md-h4">$1</h4>')
      .replace(/#### (.*?)\n/g, '<h5 class="md-h5">$1</h5>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
      .replace(/^- (.*?)\n/gm, '<li class="md-li">$1</li>')
      .replace(/\n\n/g, '<br><br>');

    // Wrap li in ul
    clean = clean.replace(/(<li class="md-li">.*<\/li>)/gs, '<ul class="md-ul">$1</ul>');
    return clean;
  }

  /**
   * Master Itinerary & Printable View
   */
  renderMasterItinerary() {
    const container = document.getElementById("itinerary-tab-content");
    if (!container) return;

    const evt = this.currentEvent;
    const calc = this.budgetManager.getCalculations();

    container.innerHTML = `
      <div class="itinerary-document glass-card">
        <div class="itinerary-header-bar">
          <div>
            <span class="badge badge-primary">MASTER EXECUTIVE ITINERARY</span>
            <h1 class="itinerary-title">${AuraPlanCore.escapeHTML(evt.title)}</h1>
            <p class="itinerary-meta">
              <strong>Date:</strong> ${AuraPlanCore.escapeHTML(evt.date)} &bull; <strong>Time:</strong> ${AuraPlanCore.escapeHTML(evt.time)} &bull; <strong>Location:</strong> ${AuraPlanCore.escapeHTML(evt.location)}
            </p>
          </div>
          <button class="btn btn-primary" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save as PDF
          </button>
        </div>

        <div class="itinerary-section">
          <h3>1. Day-Of Minute-by-Minute Run of Show</h3>
          <table class="itinerary-table">
            <thead>
              <tr>
                <th style="width: 120px;">Time</th>
                <th>Cue / Milestone</th>
                <th>Lead POC</th>
                <th>Location</th>
                <th>Key Notes</th>
              </tr>
            </thead>
            <tbody>
              ${(evt.runOfShow || []).map(r => `
                <tr>
                  <td><strong>${AuraPlanCore.escapeHTML(r.time)}</strong></td>
                  <td>${AuraPlanCore.escapeHTML(r.title)}</td>
                  <td>${AuraPlanCore.escapeHTML(r.lead || '—')}</td>
                  <td>${AuraPlanCore.escapeHTML(r.location || '—')}</td>
                  <td>${AuraPlanCore.escapeHTML(r.notes || '—')}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="itinerary-section">
          <h3>2. Key Vendor Roster & Emergency Contacts</h3>
          <table class="itinerary-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Vendor / Company</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(evt.vendors || []).map(v => `
                <tr>
                  <td><span class="category-tag-sm">${AuraPlanCore.escapeHTML(v.category)}</span></td>
                  <td><strong>${AuraPlanCore.escapeHTML(v.name)}</strong></td>
                  <td>${AuraPlanCore.escapeHTML(v.contactName || '—')}</td>
                  <td>${AuraPlanCore.escapeHTML(v.phone || '—')}</td>
                  <td>${AuraPlanCore.escapeHTML(v.email || '—')}</td>
                  <td>${AuraPlanCore.escapeHTML(v.status)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="itinerary-section">
          <h3>3. Executive Financial Overview</h3>
          <div class="itinerary-financial-grid">
            <div class="ifin-box">
              <span>Target Budget</span>
              <strong>${this.budgetManager.formatCurrency(calc.target)}</strong>
            </div>
            <div class="ifin-box">
              <span>Total Actual Spent</span>
              <strong>${this.budgetManager.formatCurrency(calc.totalActual)}</strong>
            </div>
            <div class="ifin-box">
              <span>Deposits Paid</span>
              <strong class="text-success">${this.budgetManager.formatCurrency(calc.totalPaid)}</strong>
            </div>
            <div class="ifin-box">
              <span>Balance Remaining Due</span>
              <strong>${this.budgetManager.formatCurrency(calc.balanceDue)}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachGlobalEvents() {
    // Tab switching
    document.querySelectorAll(".nav-tab-item").forEach(item => {
      item.addEventListener("click", () => {
        this.switchTab(item.dataset.tab);
      });
      item.addEventListener("keydown", event => {
        const tabs = Array.from(document.querySelectorAll(".nav-tab-item"));
        const index = tabs.indexOf(item);
        let nextIndex;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        tabs[nextIndex].focus();
        this.switchTab(tabs[nextIndex].dataset.tab);
      });
    });

    // Theme toggle
    document.getElementById("btn-toggle-theme")?.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Quick create event
    document.getElementById("btn-new-event-quick")?.addEventListener("click", () => {
      this.openCreateEventModal();
    });

    // Export/Settings
    document.getElementById("btn-app-settings")?.addEventListener("click", () => {
      this.openSettingsModal();
    });
  }

  openCreateEventModal() {
    this.showModal({
      title: "Plan a New Event with AuraPlan AI",
      content: `
        <form id="create-event-form" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="new-evt-type">Event Type *</label>
              <select name="type" id="new-evt-type" class="form-input">
                <option value="wedding">💍 Wedding & Reception</option>
                <option value="birthday">🎂 Milestone Birthday</option>
                <option value="community">🎪 Community Festival / Charity</option>
              </select>
            </div>
            <div class="form-group">
              <label for="new-evt-title">Event Name / Title *</label>
              <input id="new-evt-title" type="text" name="title" maxlength="120" required placeholder="e.g. Maya's Golden 50th Jubilee" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="new-evt-date">Event Date *</label>
              <input id="new-evt-date" type="date" name="date" required value="2026-11-20" class="form-input" />
            </div>
            <div class="form-group">
              <label for="new-evt-time">Start Time</label>
              <input id="new-evt-time" type="time" name="time" value="18:00" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="new-evt-budget">Target Budget ($ USD) *</label>
              <input id="new-evt-budget" type="number" name="budget" min="1" step="any" required value="15000" class="form-input" />
            </div>
            <div class="form-group">
              <label for="new-evt-guests">Expected Guest Count *</label>
              <input id="new-evt-guests" type="number" name="guests" min="1" max="100000" required value="80" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label for="new-evt-location">Location / City</label>
            <input id="new-evt-location" type="text" name="location" maxlength="160" placeholder="e.g. Glasshouse Pavilion, Chicago, IL" class="form-input" />
          </div>
          <div class="form-group">
            <label for="new-evt-theme">Vibe / Aesthetic Theme</label>
            <input id="new-evt-theme" type="text" name="theme" maxlength="120" placeholder="e.g. Modern Romantic Candlelit Greenhouse" class="form-input" />
          </div>
        </form>
      `,
      confirmText: "Create Event Plan",
      onConfirm: () => {
        const form = document.getElementById("create-event-form");
        if (!form || !form.reportValidity()) return false;
        const formData = new FormData(form);
        const type = String(formData.get("type") || "");
        const title = String(formData.get("title") || "").trim();
        const date = formData.get("date");
        const time = formData.get("time");
        const budget = Number(formData.get("budget") || 10000);
        const guests = Number(formData.get("guests") || 50);
        const location = String(formData.get("location") || "").trim() || "TBD";
        const theme = String(formData.get("theme") || "").trim() || "Elegant & Modern";

        if (!["wedding", "birthday", "community"].includes(type) || !title || !date ||
          !Number.isFinite(budget) || budget <= 0 || !Number.isInteger(guests) || guests <= 0) {
          this.showToast("Enter a title, date, positive budget, and valid guest count.", "warning");
          return false;
        }

        const newId = `evt-${type}-${Date.now()}`;
        const heroImg = type === "wedding" ? "assets/wedding.jpg" : type === "birthday" ? "assets/birthday.jpg" : "assets/community.jpg";

        const newEvent = {
          id: newId,
          type,
          title,
          tagline: `Curated ${type} experience celebrating ${title}`,
          date,
          time,
          location,
          guestCount: guests,
          targetBudget: budget,
          currency: "USD",
          theme,
          planningPreferences: "",
          guests: [],
          heroImage: heroImg,
          colorPalette: [
            { name: "Royal Indigo", hex: "#4338CA", role: "Primary Accent" },
            { name: "Sunlit Gold", hex: "#F59E0B", role: "Glow Accent" },
            { name: "Emerald Mist", hex: "#10B981", role: "Botanical" },
            { name: "Pure Ivory", hex: "#FDFBF7", role: "Base Canvas" },
            { name: "Slate Charcoal", hex: "#1E293B", role: "Contrast Text" }
          ],
          budgetCategories: [],
          expenses: [
            { id: "exp-new-1", category: "Venue & Rentals", name: "Venue budget estimate", estimated: Math.round(budget * 0.35), actual: 0, paid: 0, status: "Pending", due: date },
            { id: "exp-new-2", category: "Catering & Bar", name: "Catering budget estimate", estimated: Math.round(budget * 0.30), actual: 0, paid: 0, status: "Pending", due: date }
          ],
          milestones: AuraPlanCore.createStarterMilestones(type, date),
          runOfShow: [
            { time: "04:00 PM", title: "Vendor Setup & Lighting Check", lead: "Lead Coordinator", location: "Main Hall", status: "pending", notes: "Check microphones and catering tables" },
            { time: "06:00 PM", title: "Guest Arrival & Welcome Cocktails", lead: "Hostesses", location: "Foyer", status: "pending", notes: "Background acoustic playlist" },
            { time: "07:30 PM", title: "Dinner & Welcome Remarks", lead: "Master of Ceremonies", location: "Main Dining", status: "pending", notes: "Champagne toast" }
          ],
          vendors: [],
          personalizedIdeas: [
            {
              title: "Curated Welcome Cocktails",
              category: "Beverage",
              description: "Personalized signature drinks matching the event's theme and color palette.",
              tags: ["Cocktails", "Welcome"],
              impact: "High guest delight"
            }
          ],
          aiPrompts: [
            `Suggest 3 high-impact theme concepts for my ${type}`,
            `Draft a minute-by-minute timeline for ${guests} guests`,
            `Create an illustrative category allocation for my ${type} and $${budget.toLocaleString()} target budget.`
          ]
        };

        this.events.unshift(newEvent);
        this.saveEvents();
        this.switchEvent(newEvent.id);
        this.showToast(`Created new plan: "${title}"!`, "success");
        return true;
      }
    });
  }

  openSettingsModal() {
    this.showModal({
      title: "Settings & AI Configuration",
      content: `
        <div class="settings-modal-body">
          <p class="text-secondary text-sm">The built-in planner runs locally. Live Gemini requests are disabled until a secure server-side endpoint is configured; do not enter API keys in this static app.</p>

          <hr class="modal-divider" />

          <div class="form-group">
            <label><strong>Event Currency</strong></label>
            <select id="currency-select" class="form-input">
              <option value="USD" ${this.currentEvent.currency === 'USD' ? 'selected' : ''}>USD ($ - United States Dollar)</option>
              <option value="EUR" ${this.currentEvent.currency === 'EUR' ? 'selected' : ''}>EUR (€ - Euro)</option>
              <option value="GBP" ${this.currentEvent.currency === 'GBP' ? 'selected' : ''}>GBP (£ - British Pound)</option>
              <option value="CAD" ${this.currentEvent.currency === 'CAD' ? 'selected' : ''}>CAD (CA$ - Canadian Dollar)</option>
              <option value="AUD" ${this.currentEvent.currency === 'AUD' ? 'selected' : ''}>AUD (AU$ - Australian Dollar)</option>
              <option value="INR" ${this.currentEvent.currency === 'INR' ? 'selected' : ''}>INR (₹ - Indian Rupee)</option>
            </select>
          </div>

          <hr class="modal-divider" />

          <div class="backup-actions-row">
            <button class="btn btn-outline btn-sm" id="btn-export-json">
              📥 Export All Events (JSON)
            </button>
            <button class="btn btn-outline btn-sm text-danger" id="btn-reset-defaults">
              ↺ Reset to Default Templates
            </button>
          </div>
        </div>
      `,
      confirmText: "Save Settings",
      onConfirm: () => {
        const currSelect = document.getElementById("currency-select");

        if (currSelect) {
          this.currentEvent.currency = currSelect.value;
          this.saveCurrentEvent();
        }

        this.renderHeaderDetails();
        this.refreshCurrentTab();
        this.showToast("Settings updated successfully", "success");
        return true;
      }
    });

    // Sub-buttons inside settings
    document.getElementById("btn-export-json")?.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.events, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `auraplan_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast("Exported backup file", "success");
    });

    document.getElementById("btn-reset-defaults")?.addEventListener("click", () => {
      if (confirm("Reset all events to default templates? Any custom additions will be restored.")) {
        localStorage.removeItem("auraplan_events");
        this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
        this.currentEventId = this.events[0].id;
        this.currentEvent = this.events[0];
        this.saveEvents();
        this.renderEventSelector();
        this.renderHeaderDetails();
        this.refreshCurrentTab();
        this.showToast("Reset to default event templates", "info");
      }
    });
  }

  showModal({ title, content, confirmText = "Confirm", cancelText = "Cancel", onConfirm = null }) {
    const overlay = document.getElementById("global-modal-overlay");
    const container = document.getElementById("global-modal-container");
    if (!overlay || !container) return;

    container.innerHTML = `
      <div class="modal-card glass-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">${title}</h3>
          <button class="modal-close" id="modal-btn-close" type="button" aria-label="Close dialog">&times;</button>
        </div>
        <div class="modal-body">${content}</div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="modal-btn-cancel" type="button">${cancelText}</button>
          <button class="btn btn-primary" id="modal-btn-confirm" type="button">${confirmText}</button>
        </div>
      </div>
    `;

    overlay.classList.add("open");

    const previousFocus = document.activeElement;
    const modal = container.querySelector(".modal-card");
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const closeModal = () => {
      overlay.classList.remove("open");
      document.removeEventListener("keydown", handleModalKeydown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
    const handleModalKeydown = (event) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key !== "Tab" || !modal) return;

      const focusable = [...modal.querySelectorAll(focusableSelector)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.getElementById("modal-btn-close")?.addEventListener("click", closeModal);
    document.getElementById("modal-btn-cancel")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", handleModalKeydown);
    (modal?.querySelector("input:not([disabled]), select:not([disabled]), textarea:not([disabled])")
      || modal?.querySelector(focusableSelector))?.focus();
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };

    document.getElementById("modal-btn-confirm")?.addEventListener("click", () => {
      if (onConfirm) {
        const shouldClose = onConfirm();
        if (shouldClose !== false) closeModal();
      } else {
        closeModal();
      }
    });
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    const icon = type === "success" ? "✓" : type === "warning" ? "⚠️" : type === "danger" ? "✕" : "ℹ";
    const iconElement = document.createElement("span");
    iconElement.className = "toast-icon";
    iconElement.textContent = icon;
    const messageElement = document.createElement("span");
    messageElement.className = "toast-msg";
    messageElement.textContent = message;
    toast.append(iconElement, messageElement);

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-fadeout");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Instantiate upon DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AuraApp();
});
