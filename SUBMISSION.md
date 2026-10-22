# 🚀 Project Submission Brief: AuraPlan AI — The Next-Gen Intelligent Event Planning Studio

---

### 📌 Project Overview
- **Project Name:** AuraPlan AI — The Next-Gen Intelligent Event Planning Studio
- **Tagline:** Event-planning studio for Weddings, Milestone Birthdays, and Community Festivals
- **Author / Developer:** Harshal Bagul
- **Repository URL:** [https://github.com/harshalbagul725-source/auraplan-ai](https://github.com/harshalbagul725-source/auraplan-ai)
- **Live Demo URL:** [https://auraplan-ai.vercel.app/](https://auraplan-ai.vercel.app/)

---

### 💡 Elevator Pitch
Organizing large-scale events—whether a 140-guest luxury wedding, a milestone 30th rooftop celebration, or an 850-attendee community harvest festival—often requires juggling multiple spreadsheets, fragmented checklists, and stressful budgeting. 

**AuraPlan AI** brings event briefs, budgets, timelines, vendors, guest RSVPs, invitations, and moodboard concepts into one planning studio. Its local demo planner organizes details already saved by the user; no live AI model or vendor-price service is currently connected.

---

### 🌐 Key Links for Reviewers & Judges

| Resource | Link |
| :--- | :--- |
| **💻 Live Demo** | [https://auraplan-ai.vercel.app/](https://auraplan-ai.vercel.app/) |
| **📁 Source Code (GitHub)** | [https://github.com/harshalbagul725-source/auraplan-ai](https://github.com/harshalbagul725-source/auraplan-ai) |
| **📑 Documentation & Guide** | [README.md](https://github.com/harshalbagul725-source/auraplan-ai#readme) |
| **🎬 Project Demo Video** | *(Upload to YouTube/Drive — see instructions below)* |

---

### ✨ Core Innovations & Deliverables

1. **💍 🎂 🎪 Multi-Event Switcher & Custom Event Wizard**:
   - Pre-configured blueprints for **Weddings** ($42K budget, Napa Valley), **Milestone Birthdays** ($9.5K budget, Seattle), and **Community Festivals** ($24K budget, Austin).
   - Fast wizard to generate a new custom plan with budget, target date, and guest count.

2. **🤖 AuraPlan Planning Co-Pilot**:
   - Local, rule-based demo responses tailored to event logistics. A live AI model is not connected.
   - **Interactive Action Buttons**: Local demo responses can include a clickable action (`[+ Add to Budget]` or `[+ Add to Run-of-Show]`) that adds an item to the active plan.

3. **💰 Financial & Spend Analytics Engine**:
   - Live interactive SVG Donut Chart showing real-time spend distribution.
   - **Preset Budget Suggestions**: Illustrative allocation guidance, not verified industry benchmarks.
   - Invoices table with search, category filtering, and 1-click status toggling.

4. **📅 Phased Milestones & Day-of Run-of-Show Master**:
   - **Dual Layouts**: Switch between a chronological **Stream Roadmap** and an agile **Kanban Board** (`To Do`, `In Progress`, `Done`).
   - **Minute-by-Minute Run-of-Show**: Cues with exact timestamps, lead POCs, and completion checkmarks.

5. **📋 Vendor Hub & Collaboration Pipeline**:
   - 6-stage lifecycle progression (`Researching` ➔ `Confirmed`).
   - Automated balance-due calculations and local example questions for vendor discussions.

6. **🎨 Moodboard Studio & Speech Workshop**:
   - High-definition editorial moodboard photography.
   - Event-type-specific starter vendor tasks, a consolidated progress dashboard, and deterministic idea prompts adapted to the guest count, budget, theme, and saved priorities.
   - 5-swatch color harmony cards with 1-click HEX copy.
   - Local example speech, toast, and invitation drafts; no live AI service is connected.

7. **📄 Executive Master Itinerary**:
   - Aggregates all cues, vendor emergency contacts, and finances into a unified document formatted for 1-click PDF printing.

8. **🌗 Dual Luxury Design System**:
   - Luxury dark glassmorphism default + crisp light mode toggle.
9. **🗂️ Event Plan, Guests & Invitation Designer**:
   - Structured brief from saved event data, editable notes, local guest RSVP tracking, and a printable invitation preview.
   - Guest and invitation data are saved in browser storage only; there are no public RSVP links or account-based access controls.

---

### 🛠️ Technical Specifications
- **Frontend Architecture:** Semantic HTML5, Vanilla CSS3 (Custom CSS Properties, Grid, Flexbox, Glassmorphism, `@media print`), Modular ES6 JavaScript.
- **Planner Mode:** Local demo suggestions; a secure server-side AI integration is not configured.
- **Persistence:** Browser `localStorage`; no backend, authentication, or cross-device sync.
- **Deployment:** The supplied live demo is on Vercel; GitHub Actions also retains its GitHub Pages deployment workflow.
- **Runtime Dependencies:** The static frontend has no production package dependencies. Playwright and axe-core are development-only test dependencies.

---

### 📝 Instructions for Judges / Testing
1. Click the **Live Demo Link**: [https://auraplan-ai.vercel.app/](https://auraplan-ai.vercel.app/).
2. In the top header, test switching between the 3 event types using the dropdown.
3. On the **AuraPlan AI Co-Pilot** tab, click any prompt chip along the top shelf (e.g., *"Suggest 3 cost-saving floral alternatives"*).
4. In the AI response, test clicking **`+ Add to Budget`** to watch the item instantly inject into the budget!
5. Navigate to the **Budget & Financial Engine** to explore the interactive SVG Donut Chart.
6. Open the **Timeline & Run-of-Show** tab and toggle between **Stream** and **Kanban** view.
7. Click the **Theme Toggle** (sun/moon icon) in the header to switch between Dark and Light luxury modes.
