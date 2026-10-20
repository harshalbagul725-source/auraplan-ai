/**
 * AuraPlan AI - Timeline & Run-of-Show Module
 * Supports macro milestones countdown and minute-by-minute Day-Of run-of-show
 * Includes Kanban board view and chronological vertical stream view
 */

class TimelineManager {
  constructor(app) {
    this.app = app;
    this.viewMode = "milestones"; // 'milestones' | 'runofshow'
    this.layoutMode = "stream"; // 'stream' | 'kanban'
    this.phaseFilter = "all";
  }

  getCurrentEvent() {
    return this.app.currentEvent;
  }

  render() {
    const container = document.getElementById("timeline-tab-content");
    if (!container) return;

    const evt = this.getCurrentEvent();
    const milestones = evt.milestones || [];
    const runOfShow = evt.runOfShow || [];

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === "done").length;
    const pctComplete = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    container.innerHTML = `
      <div class="timeline-dashboard">
        <!-- Sub-Header Controls -->
        <div class="timeline-top-bar glass-card">
          <div class="timeline-switch-tabs">
            <button class="tab-pill ${this.viewMode === 'milestones' ? 'active' : ''}" id="btn-view-milestones">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Macro Milestones (${completedMilestones}/${totalMilestones})
            </button>
            <button class="tab-pill ${this.viewMode === 'runofshow' ? 'active' : ''}" id="btn-view-runofshow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              Day-of Run-of-Show (${runOfShow.length} Cues)
            </button>
          </div>

          <div class="timeline-actions">
            ${this.viewMode === 'milestones' ? `
              <div class="layout-toggle-group">
                <button class="btn-icon ${this.layoutMode === 'stream' ? 'active' : ''}" id="btn-layout-stream" title="Vertical Timeline Stream">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
                <button class="btn-icon ${this.layoutMode === 'kanban' ? 'active' : ''}" id="btn-layout-kanban" title="Kanban Board View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="18" rx="1"/><rect x="17" y="3" width="5" height="18" rx="1"/></svg>
                </button>
              </div>
            ` : ''}

            <button class="btn btn-outline btn-sm" id="btn-ai-timeline-help">
              <span class="ai-sparkle">✨</span> AI Optimize Timeline
            </button>

            <button class="btn btn-primary btn-sm" id="btn-add-timeline-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${this.viewMode === 'milestones' ? '+ Add Milestone' : '+ Add Run-of-Show Cue'}
            </button>
          </div>
        </div>

        <!-- Overall Progress Bar Banner -->
        ${this.viewMode === 'milestones' ? `
          <div class="milestone-progress-banner glass-card">
            <div class="progress-details">
              <div>
                <strong>Milestone Completion Progress</strong>
                <span class="text-secondary text-sm"> (${completedMilestones} of ${totalMilestones} milestones cleared)</span>
              </div>
              <span class="font-headline font-semibold text-primary">${pctComplete}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${pctComplete}%"></div>
            </div>
          </div>
        ` : ''}

        <!-- Content Area -->
        <div class="timeline-main-content">
          ${this.viewMode === 'milestones' 
            ? (this.layoutMode === 'stream' ? this.renderMilestonesStream(milestones) : this.renderMilestonesKanban(milestones))
            : this.renderRunOfShow(runOfShow)
          }
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderMilestonesStream(milestones) {
    if (!milestones.length) {
      return `<div class="empty-state glass-card"><p>No milestones created yet. Click "+ Add Milestone" or use AI to generate a full roadmap!</p></div>`;
    }

    // Group milestones by phase
    const phases = {};
    milestones.forEach(m => {
      const p = m.phase || "Upcoming";
      if (!phases[p]) phases[p] = [];
      phases[p].push(m);
    });

    return `
      <div class="milestones-stream-container">
        ${Object.entries(phases).map(([phaseName, items]) => `
          <div class="phase-section">
            <div class="phase-header">
              <div class="phase-badge">
                <span class="phase-pulse"></span>
                <span>${phaseName}</span>
              </div>
            </div>
            <div class="phase-milestones-list">
              ${items.map(m => this.renderMilestoneCard(m)).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  renderMilestoneCard(m) {
    const isDone = m.status === "done";
    const isInProgress = m.status === "in-progress";

    return `
      <div class="milestone-card glass-card ${isDone ? 'completed-card' : ''}" data-milestone-id="${m.id}">
        <div class="milestone-checkbox-wrap">
          <input type="checkbox" class="custom-checkbox" data-action="toggle-milestone" data-id="${m.id}" ${isDone ? 'checked' : ''} />
        </div>
        <div class="milestone-content">
          <div class="milestone-headline">
            <h4 class="milestone-title ${isDone ? 'line-through text-secondary' : ''}">${m.title}</h4>
            <span class="badge ${isDone ? 'badge-success' : isInProgress ? 'badge-info' : 'badge-neutral'}">
              ${isDone ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
            </span>
          </div>
          <div class="milestone-meta">
            ${m.dueDate ? `<span class="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${m.dueDate}</span>` : ''}
            ${m.owner ? `<span class="meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${m.owner}</span>` : ''}
            ${m.category ? `<span class="category-tag-sm">${m.category}</span>` : ''}
          </div>
        </div>
        <div class="milestone-actions">
          <button class="btn-icon text-danger" data-action="delete-milestone" data-id="${m.id}" title="Delete Milestone">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  renderMilestonesKanban(milestones) {
    const cols = [
      { id: "todo", title: "To Do / Backlog", status: "todo", badgeClass: "badge-neutral" },
      { id: "in-progress", title: "In Progress", status: "in-progress", badgeClass: "badge-info" },
      { id: "done", title: "Done & Verified", status: "done", badgeClass: "badge-success" }
    ];

    return `
      <div class="kanban-board">
        ${cols.map(col => {
          const items = milestones.filter(m => m.status === col.status);
          return `
            <div class="kanban-col glass-card" data-status="${col.status}">
              <div class="kanban-col-header">
                <div class="col-title-wrap">
                  <span class="kanban-dot dot-${col.id}"></span>
                  <h4>${col.title}</h4>
                </div>
                <span class="badge ${col.badgeClass}">${items.length}</span>
              </div>
              <div class="kanban-cards-container">
                ${items.map(m => `
                  <div class="kanban-card glass-card" data-milestone-id="${m.id}">
                    <div class="kanban-card-title">${m.title}</div>
                    <div class="kanban-card-meta">
                      <span class="category-tag-sm">${m.phase || m.category}</span>
                      <span class="text-xs text-secondary">${m.dueDate || ''}</span>
                    </div>
                    <div class="kanban-card-footer">
                      <span class="text-xs text-secondary">${m.owner || 'Unassigned'}</span>
                      <div class="kanban-cycle-buttons">
                        ${col.status !== 'todo' ? `<button class="btn-xs-icon" data-action="move-milestone" data-id="${m.id}" data-target="todo" title="Move to To Do">◀</button>` : ''}
                        ${col.status !== 'in-progress' ? `<button class="btn-xs-icon" data-action="move-milestone" data-id="${m.id}" data-target="in-progress" title="Move to In Progress">●</button>` : ''}
                        ${col.status !== 'done' ? `<button class="btn-xs-icon" data-action="move-milestone" data-id="${m.id}" data-target="done" title="Move to Done">▶</button>` : ''}
                      </div>
                    </div>
                  </div>
                `).join("")}
                ${items.length === 0 ? `<div class="kanban-empty">No items in this column</div>` : ''}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderRunOfShow(runOfShow) {
    if (!runOfShow.length) {
      return `<div class="empty-state glass-card"><p>No day-of schedule cues created yet. Click "+ Add Run-of-Show Cue" or let AI structure your day!</p></div>`;
    }

    return `
      <div class="runofshow-container">
        <div class="runofshow-banner glass-card">
          <div class="ros-banner-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div>
              <strong>Minute-by-Minute Master Run of Show</strong>
              <p class="text-secondary text-sm">Chronological master cues for vendor arrival, transitions, toasts, and teardown.</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-print-runofshow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Run-of-Show
          </button>
        </div>

        <div class="ros-timeline-grid">
          ${runOfShow.map((cue, idx) => {
            const isCompleted = cue.status === "completed";
            return `
              <div class="ros-card glass-card ${isCompleted ? 'ros-completed' : ''}" data-ros-index="${idx}">
                <div class="ros-time-col">
                  <div class="ros-time-pill">${cue.time}</div>
                  <div class="ros-connector-line"></div>
                </div>
                <div class="ros-body">
                  <div class="ros-main-header">
                    <h4 class="ros-title">${cue.title}</h4>
                    <button class="btn-ros-toggle ${isCompleted ? 'active' : ''}" data-action="toggle-ros" data-index="${idx}">
                      ${isCompleted ? '✓ Completed' : 'Mark Done'}
                    </button>
                  </div>
                  <div class="ros-tags-row">
                    ${cue.lead ? `<span class="ros-tag lead-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Lead: ${cue.lead}</span>` : ''}
                    ${cue.location ? `<span class="ros-tag loc-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${cue.location}</span>` : ''}
                  </div>
                  ${cue.notes ? `<p class="ros-notes"><strong>Note:</strong> ${cue.notes}</p>` : ''}
                </div>
                <div class="ros-card-actions">
                  <button class="btn-icon text-danger" data-action="delete-ros" data-index="${idx}" title="Delete Cue">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  attachEvents() {
    const btnMilestones = document.getElementById("btn-view-milestones");
    const btnRunOfShow = document.getElementById("btn-view-runofshow");

    if (btnMilestones) {
      btnMilestones.addEventListener("click", () => {
        this.viewMode = "milestones";
        this.render();
      });
    }

    if (btnRunOfShow) {
      btnRunOfShow.addEventListener("click", () => {
        this.viewMode = "runofshow";
        this.render();
      });
    }

    const btnStream = document.getElementById("btn-layout-stream");
    const btnKanban = document.getElementById("btn-layout-kanban");

    if (btnStream) {
      btnStream.addEventListener("click", () => {
        this.layoutMode = "stream";
        this.render();
      });
    }

    if (btnKanban) {
      btnKanban.addEventListener("click", () => {
        this.layoutMode = "kanban";
        this.render();
      });
    }

    const btnAdd = document.getElementById("btn-add-timeline-item");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        if (this.viewMode === "milestones") {
          this.openAddMilestoneModal();
        } else {
          this.openAddRunOfShowModal();
        }
      });
    }

    const btnAI = document.getElementById("btn-ai-timeline-help");
    if (btnAI) {
      btnAI.addEventListener("click", () => {
        const evt = this.getCurrentEvent();
        this.app.switchTab("ai");
        this.app.sendAIPrompt(`Generate a comprehensive day-of run-of-show schedule and buffer protocol for my ${evt.type} event (${evt.title}) starting at ${evt.time}`);
      });
    }

    const btnPrintRos = document.getElementById("btn-print-runofshow");
    if (btnPrintRos) {
      btnPrintRos.addEventListener("click", () => {
        this.app.switchTab("itinerary");
      });
    }

    // Delegated actions for milestones
    const timelineContainer = document.querySelector(".timeline-main-content");
    if (timelineContainer) {
      timelineContainer.addEventListener("click", (e) => {
        const toggleBtn = e.target.closest("[data-action='toggle-milestone']");
        if (toggleBtn) {
          this.toggleMilestoneStatus(toggleBtn.dataset.id);
          return;
        }

        const deleteMBtn = e.target.closest("[data-action='delete-milestone']");
        if (deleteMBtn) {
          this.deleteMilestone(deleteMBtn.dataset.id);
          return;
        }

        const moveBtn = e.target.closest("[data-action='move-milestone']");
        if (moveBtn) {
          this.moveMilestone(moveBtn.dataset.id, moveBtn.dataset.target);
          return;
        }

        const toggleRosBtn = e.target.closest("[data-action='toggle-ros']");
        if (toggleRosBtn) {
          this.toggleRosStatus(Number(toggleRosBtn.dataset.index));
          return;
        }

        const deleteRosBtn = e.target.closest("[data-action='delete-ros']");
        if (deleteRosBtn) {
          this.deleteRosItem(Number(deleteRosBtn.dataset.index));
          return;
        }
      });
    }
  }

  toggleMilestoneStatus(id) {
    const evt = this.getCurrentEvent();
    const item = evt.milestones.find(m => m.id === id);
    if (!item) return;

    item.status = item.status === "done" ? "todo" : "done";
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Updated "${item.title}" status to ${item.status}`, "info");
  }

  moveMilestone(id, newStatus) {
    const evt = this.getCurrentEvent();
    const item = evt.milestones.find(m => m.id === id);
    if (!item) return;

    item.status = newStatus;
    this.app.saveCurrentEvent();
    this.render();
  }

  deleteMilestone(id) {
    const evt = this.getCurrentEvent();
    const idx = evt.milestones.findIndex(m => m.id === id);
    if (idx === -1) return;

    const [deleted] = evt.milestones.splice(idx, 1);
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Removed milestone "${deleted.title}"`, "info");
  }

  toggleRosStatus(idx) {
    const evt = this.getCurrentEvent();
    const cue = evt.runOfShow[idx];
    if (!cue) return;

    cue.status = cue.status === "completed" ? "pending" : "completed";
    this.app.saveCurrentEvent();
    this.render();
  }

  deleteRosItem(idx) {
    const evt = this.getCurrentEvent();
    const [deleted] = evt.runOfShow.splice(idx, 1);
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Removed cue "${deleted.title}"`, "info");
  }

  addMilestoneItem(item) {
    const evt = this.getCurrentEvent();
    evt.milestones.push({
      id: `ms-${Date.now()}`,
      phase: item.phase || "Upcoming",
      title: item.title,
      dueDate: item.dueDate || "",
      owner: item.owner || "",
      status: item.status || "todo",
      category: item.category || "General"
    });
    this.app.saveCurrentEvent();
    this.render();
  }

  addRunOfShowItem(item) {
    const evt = this.getCurrentEvent();
    evt.runOfShow.push({
      time: item.time || "12:00 PM",
      title: item.title,
      lead: item.lead || "",
      location: item.location || "",
      notes: item.notes || "",
      status: "pending"
    });
    // Sort chronologically if possible
    this.app.saveCurrentEvent();
    this.render();
  }

  openAddMilestoneModal() {
    this.app.showModal({
      title: "Add Strategic Milestone",
      content: `
        <form id="add-milestone-form" class="modal-form">
          <div class="form-group">
            <label>Milestone Title *</label>
            <input type="text" name="title" required placeholder="e.g. Confirm Floral Arch Installation Details" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Planning Phase</label>
              <select name="phase" class="form-input">
                <option value="9-12 Months Out">9-12 Months Out</option>
                <option value="6-8 Months Out">6-8 Months Out</option>
                <option value="4-6 Months Out">4-6 Months Out</option>
                <option value="2-3 Months Out">2-3 Months Out</option>
                <option value="1 Month Out">1 Month Out</option>
                <option value="Final Week">Final Week</option>
                <option value="Event Day">Event Day</option>
              </select>
            </div>
            <div class="form-group">
              <label>Target Due Date</label>
              <input type="date" name="dueDate" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Person In Charge / Owner</label>
              <input type="text" name="owner" placeholder="e.g. Lead Planner / Elena" class="form-input" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input type="text" name="category" placeholder="e.g. Decor, Catering, Logistics" class="form-input" />
            </div>
          </div>
        </form>
      `,
      confirmText: "Save Milestone",
      onConfirm: () => {
        const form = document.getElementById("add-milestone-form");
        if (!form) return;
        const formData = new FormData(form);
        const title = formData.get("title");
        const phase = formData.get("phase");
        const dueDate = formData.get("dueDate");
        const owner = formData.get("owner");
        const category = formData.get("category");

        if (!title) {
          this.app.showToast("Please provide milestone title", "warning");
          return false;
        }

        this.addMilestoneItem({ title, phase, dueDate, owner, category, status: "todo" });
        this.app.showToast(`Milestone "${title}" added`, "success");
        return true;
      }
    });
  }

  openAddRunOfShowModal() {
    this.app.showModal({
      title: "Add Day-Of Run-of-Show Cue",
      content: `
        <form id="add-ros-form" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Exact Time *</label>
              <input type="text" name="time" required placeholder="e.g. 04:15 PM" class="form-input" />
            </div>
            <div class="form-group">
              <label>Event / Cue Title *</label>
              <input type="text" name="title" required placeholder="e.g. Cocktail Hour & Passed Hors d'oeuvres" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Lead POC / Contact</label>
              <input type="text" name="lead" placeholder="e.g. Head Caterer & Lead Host" class="form-input" />
            </div>
            <div class="form-group">
              <label>Location / Zone</label>
              <input type="text" name="location" placeholder="e.g. South Terrace Garden" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>Notes & Instructions</label>
            <textarea name="notes" rows="2" placeholder="e.g. Cue live jazz band; acoustic mic check at 04:10 PM" class="form-input"></textarea>
          </div>
        </form>
      `,
      confirmText: "Save Cue",
      onConfirm: () => {
        const form = document.getElementById("add-ros-form");
        if (!form) return;
        const formData = new FormData(form);
        const time = formData.get("time");
        const title = formData.get("title");
        const lead = formData.get("lead");
        const location = formData.get("location");
        const notes = formData.get("notes");

        if (!time || !title) {
          this.app.showToast("Please provide cue time and title", "warning");
          return false;
        }

        this.addRunOfShowItem({ time, title, lead, location, notes });
        this.app.showToast(`Cue "${title}" added to Run of Show`, "success");
        return true;
      }
    });
  }
}
