/**
 * AuraPlan AI - Personalized Ideas & Moodboard Studio
 * Color palettes, visual moodboards, bespoke event concepts, and speech draftsman
 */

class IdeasManager {
  constructor(app) {
    this.app = app;
  }

  getCurrentEvent() {
    return this.app.currentEvent;
  }

  render() {
    const container = document.getElementById("ideas-tab-content");
    if (!container) return;

    const evt = this.getCurrentEvent();
    const ideas = evt.personalizedIdeas || [];
    const palette = evt.colorPalette || [];

    container.innerHTML = `
      <div class="ideas-dashboard">
        <!-- Visual Moodboard Hero Banner -->
        <div class="moodboard-hero glass-card">
          <div class="moodboard-image-wrap">
            <img src="${evt.heroImage || 'assets/wedding.jpg'}" alt="${evt.title} Moodboard" class="moodboard-hero-img" />
            <div class="moodboard-overlay">
              <span class="badge badge-accent">${evt.type.toUpperCase()} MOODBOARD</span>
              <h2 class="moodboard-hero-title">${evt.theme || evt.title}</h2>
              <p class="moodboard-hero-subtitle">${evt.tagline || ''}</p>
            </div>
          </div>
        </div>

        <!-- Color Palette Showcase -->
        <div class="palette-card glass-card">
          <div class="palette-header">
            <div>
              <h3 class="card-title">Curated Color Harmony</h3>
              <p class="card-subtitle">Harmonious tones for florals, stationery, lighting, and attire</p>
            </div>
            <button class="btn btn-outline btn-sm" id="btn-ai-new-palette">
              <span class="ai-sparkle">✨</span> AI Palette Variant
            </button>
          </div>
          <div class="palette-grid">
            ${palette.map(color => `
              <div class="swatch-card" data-hex="${color.hex}">
                <div class="swatch-color" style="background-color: ${color.hex}">
                  <span class="copy-hint">Copy HEX</span>
                </div>
                <div class="swatch-details">
                  <span class="swatch-name">${color.name}</span>
                  <span class="swatch-hex">${color.hex}</span>
                  <span class="swatch-role">${color.role || 'Accent'}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- AI Idea Generator Prompt Bar -->
        <div class="idea-generator-bar glass-card">
          <div class="idea-gen-header">
            <div class="ai-badge">
              <span class="ai-sparkle">✨</span>
              <span>AuraPlan Creative Studio</span>
            </div>
            <p class="text-secondary text-sm">Tell the AI what vibe, activity, or food you want to brainstorm</p>
          </div>
          <div class="idea-gen-input-wrap">
            <input type="text" id="custom-idea-input" placeholder="e.g. A whimsical late-night dessert station or interactive cocktail ritual..." class="form-input" />
            <button class="btn btn-primary" id="btn-generate-custom-idea">
              <span class="ai-sparkle">✨</span> Generate Idea Card
            </button>
          </div>
        </div>

        <!-- Curated Ideas Grid -->
        <div class="ideas-section">
          <div class="ideas-section-header">
            <h3 class="card-title">Curated Concepts & Guest Touchpoints</h3>
            <span class="badge badge-neutral">${ideas.length} Concepts</span>
          </div>

          <div class="ideas-grid">
            ${ideas.map((idea, idx) => `
              <div class="idea-card glass-card" data-idea-index="${idx}">
                <div class="idea-card-header">
                  <div class="idea-category-wrap">
                    <span class="category-tag-sm">${idea.category}</span>
                    <span class="idea-impact">${idea.impact || 'High Impact'}</span>
                  </div>
                  <button class="btn-icon text-danger" data-action="delete-idea" data-index="${idx}" title="Remove Concept">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
                <h4 class="idea-title">${idea.title}</h4>
                <p class="idea-desc">${idea.description}</p>
                <div class="idea-tags">
                  ${(idea.tags || []).map(t => `<span class="idea-tag-chip">#${t}</span>`).join("")}
                </div>
                <div class="idea-card-footer">
                  <button class="btn-text-action" data-action="expand-idea" data-title="${idea.title}">
                    <span class="ai-sparkle">✨</span> Brainstorm Execution
                  </button>
                  <button class="btn btn-outline btn-sm" data-action="add-idea-budget" data-title="${idea.title}">
                    + Add to Budget
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Speech & Toast Workshop Section -->
        <div class="speech-workshop glass-card">
          <div class="speech-workshop-header">
            <div>
              <h3 class="card-title">Speech, Toast & Invitation Workshop</h3>
              <p class="card-subtitle">AI-assisted drafts for speeches, welcomes, and digital invitations</p>
            </div>
            <div class="speech-controls">
              <select id="speech-tone" class="select-dropdown">
                <option value="heartfelt">Heartfelt & Emotional</option>
                <option value="humorous">Witty & Humorous</option>
                <option value="formal">Elegant & Formal</option>
                <option value="energetic">High-Energy & Inspiring</option>
              </select>
              <button class="btn btn-primary btn-sm" id="btn-draft-speech">
                <span class="ai-sparkle">✨</span> Draft Speech
              </button>
              <button class="btn btn-outline btn-sm" id="btn-draft-invite">
                <span class="ai-sparkle">✨</span> Draft Invitation
              </button>
            </div>
          </div>
          <div class="speech-output-box" id="speech-output-container">
            <div class="speech-placeholder">
              <span>Select a tone and click <strong>Draft Speech</strong> or <strong>Draft Invitation</strong> to produce instant tailored copy.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Copy HEX swatches
    document.querySelectorAll(".swatch-card").forEach(swatch => {
      swatch.addEventListener("click", () => {
        const hex = swatch.dataset.hex;
        if (hex) {
          navigator.clipboard.writeText(hex).then(() => {
            this.app.showToast(`Copied ${hex} to clipboard!`, "success");
          });
        }
      });
    });

    const btnGenerateIdea = document.getElementById("btn-generate-custom-idea");
    if (btnGenerateIdea) {
      btnGenerateIdea.addEventListener("click", () => this.generateCustomIdea());
    }

    const customInput = document.getElementById("custom-idea-input");
    if (customInput) {
      customInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.generateCustomIdea();
      });
    }

    const btnNewPalette = document.getElementById("btn-ai-new-palette");
    if (btnNewPalette) {
      btnNewPalette.addEventListener("click", () => {
        this.app.switchTab("ai");
        this.app.sendAIPrompt(`Generate a fresh alternative color palette with 5 HEX codes and aesthetic concepts for my ${this.getCurrentEvent().type} event.`);
      });
    }

    // Speech & invite buttons
    const btnSpeech = document.getElementById("btn-draft-speech");
    if (btnSpeech) {
      btnSpeech.addEventListener("click", () => this.generateSpeech());
    }

    const btnInvite = document.getElementById("btn-draft-invite");
    if (btnInvite) {
      btnInvite.addEventListener("click", () => this.generateInvite());
    }

    // Delegated actions for ideas
    const ideasSection = document.querySelector(".ideas-section");
    if (ideasSection) {
      ideasSection.addEventListener("click", (e) => {
        const delBtn = e.target.closest("[data-action='delete-idea']");
        if (delBtn) {
          this.deleteIdea(Number(delBtn.dataset.index));
          return;
        }

        const expandBtn = e.target.closest("[data-action='expand-idea']");
        if (expandBtn) {
          const title = expandBtn.dataset.title;
          this.app.switchTab("ai");
          this.app.sendAIPrompt(`Help me detail the logistics, vendor requirements, and estimated cost for the concept: "${title}"`);
          return;
        }

        const addBudgetBtn = e.target.closest("[data-action='add-idea-budget']");
        if (addBudgetBtn) {
          const title = addBudgetBtn.dataset.title;
          this.app.budgetManager.addExpenseItem({
            name: title,
            category: "Decor & Florals",
            estimated: 750,
            status: "Pending"
          });
          this.app.showToast(`Added "${title}" ($750 est.) to Budget!`, "success");
        }
      });
    }
  }

  deleteIdea(idx) {
    const evt = this.getCurrentEvent();
    const [deleted] = evt.personalizedIdeas.splice(idx, 1);
    this.app.saveCurrentEvent();
    this.render();
    this.app.showToast(`Removed concept "${deleted.title}"`, "info");
  }

  async generateCustomIdea() {
    const input = document.getElementById("custom-idea-input");
    if (!input || !input.value.trim()) {
      this.app.showToast("Please enter a concept or keyword", "warning");
      return;
    }

    const keyword = input.value.trim();
    const evt = this.getCurrentEvent();

    this.app.showToast("Synthesizing creative concept...", "info");

    const newIdea = {
      title: keyword.length > 30 ? keyword.slice(0, 30) + "..." : keyword,
      category: "Personalized Experience",
      description: `An immersive ${keyword.toLowerCase()} tailored for ${evt.title}. Features custom styling, thoughtful guest flow, and seamless coordination with existing vendor schedules.`,
      tags: ["Custom", "AI-Generated", "Memorable"],
      impact: "High guest resonance"
    };

    evt.personalizedIdeas.unshift(newIdea);
    this.app.saveCurrentEvent();
    input.value = "";
    this.render();
    this.app.showToast("Creative concept added to your moodboard!", "success");
  }

  async generateSpeech() {
    const tone = document.getElementById("speech-tone")?.value || "heartfelt";
    const evt = this.getCurrentEvent();
    const container = document.getElementById("speech-output-container");
    if (!container) return;

    container.innerHTML = `<div class="speech-loading"><span class="ai-sparkle">✨</span> Drafting ${tone} speech with AuraPlan AI...</div>`;

    const prompt = `Draft a ${tone} speech/toast for ${evt.title} (${evt.type}).`;
    const draft = await window.auraAI.ask(prompt, evt);

    container.innerHTML = `
      <div class="speech-result">
        <div class="speech-result-top">
          <span class="badge badge-accent">${tone.toUpperCase()} SPEECH DRAFT</span>
          <button class="btn btn-sm btn-outline" id="btn-copy-speech">Copy to Clipboard</button>
        </div>
        <div class="speech-markdown">${this.app.formatMarkdown(draft)}</div>
      </div>
    `;

    document.getElementById("btn-copy-speech")?.addEventListener("click", () => {
      navigator.clipboard.writeText(draft).then(() => {
        this.app.showToast("Speech draft copied to clipboard!", "success");
      });
    });
  }

  async generateInvite() {
    const tone = document.getElementById("speech-tone")?.value || "heartfelt";
    const evt = this.getCurrentEvent();
    const container = document.getElementById("speech-output-container");
    if (!container) return;

    container.innerHTML = `<div class="speech-loading"><span class="ai-sparkle">✨</span> Drafting digital invitation copy with AuraPlan AI...</div>`;

    const prompt = `Draft invitation copy for ${evt.title} on ${evt.date} in a ${tone} tone.`;
    const draft = await window.auraAI.ask(prompt, evt);

    container.innerHTML = `
      <div class="speech-result">
        <div class="speech-result-top">
          <span class="badge badge-info">DIGITAL INVITATION DRAFT</span>
          <button class="btn btn-sm btn-outline" id="btn-copy-speech">Copy to Clipboard</button>
        </div>
        <div class="speech-markdown">${this.app.formatMarkdown(draft)}</div>
      </div>
    `;

    document.getElementById("btn-copy-speech")?.addEventListener("click", () => {
      navigator.clipboard.writeText(draft).then(() => {
        this.app.showToast("Invitation copy copied to clipboard!", "success");
      });
    });
  }
}
