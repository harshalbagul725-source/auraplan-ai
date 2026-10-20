# 🌟 AuraPlan AI — The Next-Gen Intelligent Event Planning Studio

[![Live Demo Website](https://img.shields.io/badge/Live%20Demo%20Website-https%3A%2F%2Fharshalbagul725--source.github.io%2Fauraplan--ai%2F-success?style=for-the-badge&logo=githubpages&logoColor=white)](https://harshalbagul725-source.github.io/auraplan-ai/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/harshalbagul725-source/auraplan-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Built%20With-HTML5%20%2B%20Vanilla%20CSS%20%2B%20ES6-6366f1.svg)](#technology-stack)
[![AI Engine](https://img.shields.io/badge/GenAI-Google%20Gemini%20Flash%20%2B%20Native%20Engine-10b981.svg)](#ai-co-pilot-studio)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-%3C%201%20MB-success.svg)](#lightweight-architecture)

---

> ## 🚀 Live Interactive Application URLs
> 
> - 🌐 **Official Public Web App (Permanent):** **[https://harshalbagul725-source.github.io/auraplan-ai/](https://harshalbagul725-source.github.io/auraplan-ai/)**
> - ⚡ **Instant Live Preview Tunnel:** **[https://7ee5395e790706.lhr.life](https://7ee5395e790706.lhr.life)**
> - 💻 **Local Development Server:** `http://localhost:8080/`
> 
> *Reviewers and judges can immediately launch either live link above in any browser.*

---

### 📁 **GitHub Source Code:** **[https://github.com/harshalbagul725-source/auraplan-ai](https://github.com/harshalbagul725-source/auraplan-ai)**
### 📄 **Official Submission Brief:** **[SUBMISSION.md](SUBMISSION.md)**

---

## 📑 Table of Contents
1. [Key Features & Capabilities](#-key-features--capabilities)
2. [Quick Start & Local Setup](#-quick-start--local-setup)
3. [Step-by-Step Guide: How to Control & Use the App](#-step-by-step-guide-how-to-control--use-the-app)
4. [Ready-to-Use AI Chat Prompts (Copy & Paste)](#-ready-to-use-ai-chat-prompts-copy--paste)
5. [Event Types & Sample Blueprints](#-event-types--sample-blueprints)
6. [Interactive Action Injection Engine](#-interactive-action-injection-engine)
7. [Technology Stack & Architecture](#-technology-stack--architecture)
8. [Configuration & Gemini API Integration](#-configuration--gemini-api-integration)
9. [Lightweight Architecture (< 10 MB)](#-lightweight-architecture--10-mb)

---

## 🚀 Key Features & Capabilities

### 💍 🎂 🎪 Multi-Event Planning Engine
- **Pre-configured Blueprints**: Out-of-the-box support for **Weddings**, **Milestone Birthdays**, and **Community Festivals** with real-world guest counts, benchmark budgets, and vendor checklists.
- **Custom Event Creator Wizard**: Launch any custom event with a target date, estimated guest count, total budget cap, and theme.

### ✨ AuraPlan AI Co-Pilot Studio
- **Dual Engine Intelligence**: Operates seamlessly with its built-in context-aware heuristic engine or connects live to **Google Gemini 1.5 Flash**.
- **Interactive Action Buttons**: Directly injects suggested items into the active budget (`+ Add to Budget`) or day-of timeline (`+ Add to Run-of-Show`) directly from the AI chat stream!
- **One-Click Prompt Shelf**: Pre-curated prompts tailored to the active event type.

### 💰 Dynamic Budget & Financial Engine
- **Real-Time SVG Donut Chart**: Hoverable, color-coded spending distribution across event categories.
- **Executive KPIs**: Track Target Budget, Committed/Spent, Secured Deposits, and Remaining Cushion Buffer.
- **AI Auto-Allocator**: Automatically splits total budget based on verified industry standard percentages.
- **Invoice & Expense Tracker**: Filter by category and payment status (`Paid`, `Deposit Paid`, `Pending`), with search and 1-click status toggling.

### 📅 Timeline & Run-of-Show Master
- **Macro Milestones Roadmap**: Phased planning (12 Months Out, 6 Months Out, 1 Month Out, Event Day).
- **Dual Layout Views**: Switch between a chronological **Vertical Stream View** and an agile **Kanban Board** (`To Do`, `In Progress`, `Done`).
- **Minute-by-Minute Run-of-Show**: Detailed day-of cues with timestamps, lead persons-in-charge, locations, and completion toggles.

### 📋 Vendor Hub & Collaboration Checklist
- **Lifecycle Pipeline Steppers**: Track vendors across 6 standardized stages: `Researching` ➔ `Contacted` ➔ `Proposal Received` ➔ `Contract Signed` ➔ `Deposit Paid` ➔ `Confirmed`.
- **Financial Balance Tracking**: Total quote values, paid deposits, and remaining balances due.
- **AI Vetting Assistant**: Instantly generates essential contract clauses and questions to ask prior to booking.

### 💡 Personalized Ideas & Moodboard Studio
- **Editorial Moodboard Gallery**: Bespoke photography representing each event aesthetic.
- **Interactive Color Palette**: 5 curated swatches with HEX color codes and 1-click clipboard copy.
- **Speech, Toast & Invitation Workshop**: AI-drafted maid-of-honor speeches, birthday toasts, community welcome addresses, and digital invitation copy.

### 📄 Executive Master Itinerary & Print Binder
- Aggregates the minute-by-minute run-of-show, emergency vendor contacts, and financial overview into a clean, unified document.
- Fully styled for 1-click printing or "Save as PDF" (`@media print` supported).

---

## ⚡ Quick Start & Local Setup

AuraPlan AI is built with zero heavyweight build dependencies. You can run it instantly using any web server:

### Option A: Using Python (Recommended)
```powershell
# Navigate to the repository
cd auraplan-ai

# Start a lightweight local server
python -m http.server 8080
```
Open **`http://localhost:8080`** in your browser.

### Option B: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click [`index.html`](index.html) and select **Open with Live Server**.

### Option C: Direct Browser Launch
Simply double-click [`index.html`](index.html) to run it locally in any modern web browser.

---

## 🎮 Step-by-Step Guide: How to Control & Use the App

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AURAPLAN AI WORKFLOW                            │
│                                                                        │
│  [1. Select Event] ──► [2. Chat with AI Co-Pilot] ──► [3. Allocate Budget]
│           │                                                    │       │
│           ▼                                                    ▼       │
│  [4. Build Timeline] ──► [5. Manage Vendors] ──► [6. Ideas & Speeches] │
│                                                                │       │
│                                                                ▼       │
│                                           [7. Print Executive Binder] │
└────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Switch or Create an Event
1. Click the **Event Dropdown** in the top header.
2. Select one of the preloaded demo blueprints:
   - 🌸 **Elena & Marcus’s Botanical Glasshouse Wedding**
   - ⚡ **Leo’s Cyberpunk Neon Rooftop 30th Birthday**
   - 🌾 **Oakridge Harvest & Arts Community Festival**
3. Or click **"+ New Event"** to launch the wizard and enter your custom event name, target date, guest count, and total budget.

### Step 2: Use the AI Planning Co-Pilot
1. Navigate to the **AuraPlan AI Co-Pilot** tab (`✨`).
2. Click any of the **Recommended Planning Prompts** chips along the top shelf.
3. Or type your question in the chat input (e.g. *"Suggest 3 cost-saving alternatives for catering"*).
4. When the AI returns a suggestion with an action button (e.g., `+ Add to Budget` or `+ Add to Run-of-Show`), click it to inject the item directly into your project!

### Step 3: Manage Budgets & Invoices
1. Open the **Budget & Financial Engine** tab.
2. Review the **Donut Chart** and category legend to inspect your spend distribution.
3. Click **"AI Auto-Allocator"** to auto-calculate recommended spending percentages based on industry benchmarks.
4. Click **"+ Add Expense"** to add a new invoice with category, estimated cost, actual cost, and due date.
5. Use the checkmark icon (`✓`) in the table to toggle payment status between `Paid` and `Pending`.

### Step 4: Organize Timelines & Day-of Run-of-Show
1. Open the **Timeline & Run-of-Show** tab.
2. Toggle between **Macro Milestones** and **Day-of Run-of-Show**.
3. Under **Macro Milestones**, switch between:
   - **Stream View**: Phased checklist ordered by countdown timeline.
   - **Kanban Board**: Drag/move cards between `To Do`, `In Progress`, and `Done`.
4. Under **Day-of Run-of-Show**, track arrival times, cue notes, and click **"Mark Done"** as activities complete.

### Step 5: Vet and Track Vendors
1. Open the **Vendor Hub & Checklist** tab.
2. Filter vendors by category (Venue, Catering, Photography, Music, etc.).
3. Click **"Advance Stage ➔"** on any vendor card to move them from `Researching` ➔ `Contacted` ➔ `Proposal Received` ➔ `Contract Signed` ➔ `Deposit Paid` ➔ `Confirmed`.
4. Click **"✨ Questions to Ask"** on any vendor card to prompt the AI for category-specific vetting questions.

### Step 6: Explore Moodboards, Colors & Generate Speeches
1. Open the **Ideas & Moodboard Studio** tab.
2. Click any color swatch in the **Curated Color Harmony** to copy its HEX code.
3. Type an idea in the **Creative Studio** bar (e.g. *"Late-night wood-fired pizza cart"*) to generate a structured concept card.
4. Scroll to the **Speech, Toast & Invitation Workshop**:
   - Choose a tone (`Heartfelt`, `Witty & Humorous`, `Formal`, `Energetic`).
   - Click **"Draft Speech"** or **"Draft Invitation"** to generate instant tailored copy with one-click copy.

### Step 7: Export Master Itinerary & Print
1. Open the **Master Itinerary & Print** tab.
2. Review the aggregated run-of-show, vendor emergency contact list, and financial summary.
3. Click **"Print / Save as PDF"** to produce an executive event binder.

---

## 💬 Ready-to-Use AI Chat Prompts (Copy & Paste)

Here are high-impact prompts you can copy and paste directly into the **AuraPlan AI Co-Pilot** chat:

### 💰 Budget & Cost-Saving Prompts
```
"Analyze my current event budget and suggest 4 high-impact areas where I can reduce costs by 15% without hurting guest experience."
```
```
"What is the standard tipping protocol and percentage for each vendor category (caterer, DJ, photographer, coordinator)?"
```
```
"How can I negotiate minimum beverage spend with my venue while maintaining an open-bar feel?"
```

### 📋 Vendor Vetting & Contract Clauses
```
"What are the top 5 essential contract clauses I must insist on before signing my wedding photographer?"
```
```
"Give me a checklist of power, load-in, and sound ordinance questions to ask the venue coordinator."
```
```
"Draft a polite inquiry email to a catering company requesting a proposal and dietary accommodation pricing for 120 guests."
```

### ⏱️ Timeline & Day-of Crisis Contingency
```
"Structure an hour-by-hour day-of timeline for an evening birthday party starting at 7:00 PM with 75 guests."
```
```
"What is a realistic buffer schedule for wedding ceremony hair and makeup with 6 bridesmaids and 1 bride?"
```
```
"What are the top 3 emergency weather backup plans I need for an outdoor park community festival?"
```

### 💌 Speeches, Toasts & Invitations
```
"Draft a 2-minute witty and heartfelt Best Man speech with gentle jokes about college memories and sincere praise for the couple."
```
```
"Write an inspiring 3-minute opening welcome speech for a community charity 5K and harvest festival."
```
```
"Create an elegant digital invitation text for a 30th birthday milestone rooftop party with RSVP deadline and dress code instructions."
```

### 🎨 Creative Themes & Menu Brainstorming
```
"Suggest 3 signature cocktail and mocktail recipes with clever names that match an emerald and champagne botanical theme."
```
```
"Brainstorm 4 interactive, non-awkward icebreaker activities for a community arts festival."
```
```
"Suggest late-night comfort food snack ideas that can be served directly to the dance floor at 10:30 PM."
```

---

## 🎪 Event Types & Sample Blueprints

| Blueprint | Type | Target Budget | Guests | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Elena & Marcus** | Wedding | $42,000 | 140 | Napa Valley Glasshouse, acoustic ceremony, farm-to-table plating, floral arches. |
| **Leo's 30th** | Birthday | $9,500 | 65 | Seattle rooftop skydeck, cyberpunk neon lighting, molecular cocktails, 360 photo booth. |
| **Oakridge Harvest** | Community | $24,000 | 850 | Riverfront amphitheater, artisan craft pavilions, live indie folk stage, composting hubs. |

---

## 🔌 Interactive Action Injection Engine

AuraPlan AI parses structured tags emitted by the generative assistant to render actionable UI widgets in real time:

- **Budget Tag**: `[BUDGET_ITEM: Category | Item Name | Cost]`  
  *Renders an interactive `+ Add to Budget` button in the chat bubble.*
- **Timeline Tag**: `[TIMELINE_ITEM: Time | Title | Description]`  
  *Renders an interactive `+ Add to Run-of-Show` button in the chat bubble.*

Clicking either button commits the item directly to local state and updates all linked charts and tables immediately.

---

## 🛠️ Technology Stack & Architecture

- **Core**: Vanilla HTML5 + ES6 JavaScript (zero build step, instant execution).
- **Styling**: Pure Vanilla CSS with CSS Custom Properties, flexbox/grid layouts, and glassmorphism.
- **Icons**: Clean SVG vector iconography.
- **Fonts**: Google Fonts (`Outfit` for headlines, `Plus Jakarta Sans` for body).
- **Data Persistence**: Automatic browser `localStorage` syncing with JSON export/import backup options.
- **Print Optimization**: Comprehensive `@media print` rules for executive PDF export.

```
genai-event-planner/
├── index.html              # Main application single-page layout
├── styles.css              # Design system tokens, glassmorphism, responsive rules
├── README.md               # Professional documentation & user guide
├── push_to_github.ps1      # Helper script for remote git management
├── assets/                 # Lightweight optimized image assets
│   ├── wedding.jpg         # Botanical wedding theme visual (~296 KB)
│   ├── birthday.jpg        # Neon rooftop birthday visual (~220 KB)
│   └── community.jpg       # Community festival visual (~299 KB)
└── js/
    ├── app.js              # Application orchestrator, event switching, modals & toasts
    ├── ai-engine.js        # AI chat engine, prompt studio & Gemini API caller
    ├── budget.js           # Budget manager, SVG donut chart & auto-allocator
    ├── timeline.js         # Milestones countdown, Kanban board & Run-of-Show
    ├── vendors.js          # Vendor directory, pipeline steppers & vetting
    ├── ideas.js            # Moodboard showcase, color swatches & speech workshop
    └── data.js             # Initial templates & industry benchmark data
```

---

## 🔑 Configuration & Gemini API Integration

1. Click the **Settings Gear** (`⚙️`) in the top-right corner of the header.
2. Enter your **Google Gemini API Key** (optional).
   - If provided, AuraPlan AI will send live queries to `gemini-1.5-flash`.
   - If omitted, AuraPlan AI runs its built-in context-aware simulation engine.
3. Select your preferred **Currency** (`USD $`, `EUR €`, `GBP £`, `CAD $`, `AUD $`, `INR ₹`).
4. Click **"Save Settings"**.

---

## 🪶 Lightweight Architecture (< 10 MB)

This repository is optimized to ensure maximum performance and minimal footprint:
- **Total Repository Footprint:** **~1.1 MB** (well below the 10 MB limit).
- **Optimized Assets:** High-resolution photography compressed with sub-300KB payloads without visual artifacting.
- **Zero Heavy Dependencies:** No `node_modules`, no external build bloat, and pure native browser execution.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
