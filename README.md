# 🌟 AuraPlan AI — The Next-Gen Intelligent Event Planning Studio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-success?style=for-the-badge)](https://auraplan-ai.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/harshalbagul725-source/auraplan-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Built%20With-HTML5%20%2B%20Vanilla%20CSS%20%2B%20ES6-6366f1.svg)](#technology-stack)
[![AI Engine](https://img.shields.io/badge/Planner-Local%20Demo%20Mode-6366f1.svg)](#ai-co-pilot-studio)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-%3C%2010%20MB-success.svg)](#lightweight-architecture)

---

> ## 🚀 Live Demo URL
> 
> ### 🔗 **[https://auraplan-ai.vercel.app/](https://auraplan-ai.vercel.app/)**
> 
> *The event-planning studio is available online. Plans, guest lists, and invitations remain in the current browser only.*

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
8. [AI Mode & Configuration](#-ai-mode--configuration)
9. [Lightweight Architecture (< 10 MB)](#-lightweight-architecture--10-mb)

---

## 🚀 Key Features & Capabilities

### 💍 🎂 🎪 Multi-Event Planning Engine
- **Pre-configured Blueprints**: Out-of-the-box support for **Weddings**, **Milestone Birthdays**, and **Community Festivals** with real-world guest counts, benchmark budgets, and vendor checklists.
- **Custom Event Creator Wizard**: Launch any custom event with a target date, estimated guest count, total budget cap, and theme.
- **Unified Event Dashboard**: Review the event brief, current budget balance, upcoming tasks, timeline completion, and vendor category coverage together.

### ✨ AuraPlan AI Co-Pilot Studio
- **Local Demo Planner**: The built-in context-aware planning engine is clearly identified as local demo functionality; it does not claim a live model is connected.
- **Interactive Action Buttons**: Directly injects suggested items into the active budget (`+ Add to Budget`) or day-of timeline (`+ Add to Run-of-Show`) directly from the AI chat stream!
- **One-Click Prompt Shelf**: Pre-curated prompts tailored to the active event type.

### 🗂️ Structured Event Plan
- Combines the event brief, saved estimates, existing checklist, run-of-show, and moodboard concepts in one plan.
- Supports saved planning priorities, editable notes, budget-overrun visibility, and regenerating from current event data.
- Estimates and schedule entries come from the user's saved event; no live vendor prices are represented.

### 💌 Guests, RSVPs & Invitations
- Add guests with optional email and dietary notes, track invited/attending/declined responses, and review totals.
- Edit a themed invitation preview and print it or save it as a PDF through the browser.
- Guest information and invitation drafts are stored in this browser only. There is no account, backend, sync, or public RSVP link.

### 💰 Dynamic Budget & Financial Engine
- **Real-Time SVG Donut Chart**: Hoverable, color-coded spending distribution across event categories.
- **Executive KPIs**: Track Target Budget, Committed/Spent, Secured Deposits, and Remaining Cushion Buffer.
- **Budget Suggestions**: Provides preset allocation guidance; percentages are not live research or verified vendor benchmarks.
- **Invoice & Expense Tracker**: Filter by category and payment status (`Paid`, `Deposit Paid`, `Pending`), with search and 1-click status toggling.

### 📅 Timeline & Run-of-Show Master
- **Macro Milestones Roadmap**: Phased planning (12 Months Out, 6 Months Out, 1 Month Out, Event Day).
- **Dual Layout Views**: Switch between a chronological **Vertical Stream View** and an agile **Kanban Board** (`To Do`, `In Progress`, `Done`).
- **Minute-by-Minute Run-of-Show**: Detailed day-of cues with timestamps, lead persons-in-charge, locations, and completion toggles.

### 📋 Vendor Hub & Collaboration Checklist
- **Lifecycle Pipeline Steppers**: Track vendors across 6 standardized stages: `Researching` ➔ `Contacted` ➔ `Proposal Received` ➔ `Contract Signed` ➔ `Deposit Paid` ➔ `Confirmed`.
- **Financial Balance Tracking**: Total quote values, paid deposits, and remaining balances due.
- **Vendor Question Suggestions**: Provides local example questions to consider before booking.

### 💡 Personalized Ideas & Moodboard Studio
- **Editorial Moodboard Gallery**: Bespoke photography representing each event aesthetic.
- **Contextual Planning Prompts**: Local suggestions cover themes, decor, food, activities, and guest experience using event type, budget per guest, guest count, theme, and saved priorities. These are deterministic prompts, not GenAI output.
- **Interactive Color Palette**: 5 curated swatches with HEX color codes and 1-click clipboard copy.
- **Speech, Toast & Invitation Workshop**: Provides local example drafts; these are not generated by a connected language model.

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
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Open **`http://localhost:3000`** in your browser.

### Run automated checks
Install Node.js 22 or newer, then from the repository directory install the development test tools and run:

```powershell
npm ci
npm test
npm run test:watch
npm run test:coverage
npm run check
npx playwright install chromium
npm run test:e2e
```

`npm run test:watch` stays open and reruns the unit tests when files change. The coverage command reports the critical pure business logic in `js/planning-core.js` and enforces 90% line/function and 70% branch coverage; it is not whole-application browser-code coverage. Playwright and axe-core are development-only dependencies used for browser workflows, responsive checks, and automated WCAG 2.1 A/AA checks. The project is a static site and does not define a production build script.

### Latest project update
- Expanded unit coverage for budget calculations, event-plan normalization, guest validation, invitation defaults, and safe HTML handling.
- Added browser coverage for custom event creation, input validation, saved event persistence, dialog keyboard behavior, and accessibility.
- Added an event overview dashboard, event-specific starter vendor tasks, contextual local idea prompts, and validation for expense amounts and payment totals.
- Budget totals now distinguish an explicitly entered zero actual cost from an absent actual cost.
- The event dialog has an accessible name and traps/restores keyboard focus; event form fields have associated labels.
- The verified focused coverage threshold applies to `js/planning-core.js` only. Browser tests separately exercise end-to-end workflows, all app tabs in both themes, and common responsive widths.
- The planner runs in local demo mode. Plans, guests, and invitation drafts stay in browser storage; live AI, user accounts, server sync, and public RSVP links are not configured.

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

### Step 2: Use the AuraPlan Planning Co-Pilot
1. Navigate to the **AuraPlan AI Co-Pilot** tab (`✨`).
2. Click any of the **Recommended Planning Prompts** chips along the top shelf.
3. Or type your question in the chat input (e.g. *"Suggest 3 cost-saving alternatives for catering"*). The current helper uses local rules and sample responses; a live AI model is not connected.
4. When the AI returns a suggestion with an action button (e.g., `+ Add to Budget` or `+ Add to Run-of-Show`), click it to inject the item directly into your project!

### Step 3: Manage Budgets & Invoices
1. Open the **Budget & Financial Engine** tab.
2. Review the **Donut Chart** and category legend to inspect your spend distribution.
3. Click **"Budget Suggestions"** for illustrative preset allocation guidance, not verified industry benchmarks.
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
4. Click **"Vendor Question Suggestions"** to view local example questions for vendor discussions.

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

The local demo planner can emit structured tags that render actionable UI widgets:

- **Budget Tag**: `[BUDGET_ITEM: Category | Item Name | Cost]`  
  *Renders an interactive `+ Add to Budget` button in the chat bubble.*
- **Timeline Tag**: `[TIMELINE_ITEM: Time | Title | Description]`  
  *Renders an interactive `+ Add to Run-of-Show` button in the chat bubble.*

Clicking either button validates and saves the item with the active event; related views use the saved values when opened.

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
    ├── ai-engine.js        # Local demo chat and suggestion engine
    ├── budget.js           # Budget manager, SVG donut chart & auto-allocator
    ├── timeline.js         # Milestones countdown, Kanban board & Run-of-Show
    ├── vendors.js          # Vendor directory, pipeline steppers & vetting
    ├── ideas.js            # Moodboard showcase, color swatches & speech workshop
    ├── data.js             # Initial templates & industry benchmark data
    ├── planning-core.js    # Structured-plan generation and validated local data helpers
    ├── planner.js          # Event plan UI and local save workflow
    ├── guests.js           # Browser-local guest and RSVP management
    └── invitation.js       # Editable invitation preview and print flow
```

---

## 🔑 AI Mode & Configuration

Live Gemini requests are currently disabled. This project is a static client and cannot keep an API key secret; do not enter or embed private API keys in the browser. The app runs its labeled local demo planner until a server-side endpoint and secret environment variable are configured.

Use the **Settings Gear** (`⚙️`) to choose an event currency or export a local JSON backup. Guest records and plans stay in browser storage and are not protected by user accounts; do not use the app for sensitive guest data on shared devices.

### Recommended GenAI integration

For deployment, add a same-origin Vercel Function such as `/api/suggestions` and call it from the existing browser UI. Keep the model provider key in a Vercel server-side environment variable; never put it in `index.html`, client-side JavaScript, or browser storage. The function should validate event type, guest count, budget, theme, and preference lengths; apply request limits; handle provider timeouts and errors; and return structured suggestions. A provider such as Gemini or OpenAI can run behind this endpoint. Until it is implemented and configured, all in-app ideas remain clearly labeled local demo prompts.

### Vercel deployment

This project is a static site and has no production build step. In Vercel, import the repository, select **Other** as the framework preset, leave the build command empty, and use the repository root as the output directory. No runtime dependency or environment variable is needed for the current local-demo application. A server-side model key is only needed if the recommended API function is added.

---

## 🪶 Lightweight Architecture (< 10 MB)

This repository is optimized to ensure maximum performance and minimal footprint:
- **Tracked project files:** **~1.1 MB**; the local Git object database is **~6 MB**. Both are below the 10 MB target.
- **Optimized Assets:** High-resolution photography compressed with sub-300KB payloads without visual artifacting.
- **Zero Heavy Dependencies:** No `node_modules`, no external build bloat, and pure native browser execution.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
