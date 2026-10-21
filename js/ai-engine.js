/**
 * AuraPlan AI - GenAI Planning Engine
 * Provides the local demo planning engine. Live model requests require a server proxy.
 */

class AIEngine {
  constructor() {
    localStorage.removeItem("auraplan_gemini_key");
  }

  /**
   * Keep generated responses in the explicitly labeled local demo mode.
   */
  async ask(prompt, currentEvent, onChunk = null) {
    return await this.simulateAIGeneration(prompt, currentEvent, onChunk);
  }

  /**
   * High-fidelity context-aware local generation
   */
  async simulateAIGeneration(prompt, currentEvent, onChunk) {
    const p = prompt.toLowerCase();
    let responseText = "";

    // 1. Theme and Moodboard Concept
    if (p.includes("theme") || p.includes("aesthetic") || p.includes("moodboard") || p.includes("color")) {
      responseText = this.generateThemeResponse(currentEvent);
    }
    // 2. Speech or Invitation draft
    else if (p.includes("speech") || p.includes("toast") || p.includes("invite") || p.includes("invitation")) {
      responseText = this.generateSpeechOrInviteResponse(p, currentEvent);
    }
    // 3. Budget optimization & cost savings
    else if (p.includes("budget") || p.includes("cost") || p.includes("saving") || p.includes("allocation") || p.includes("reduce")) {
      responseText = this.generateBudgetResponse(currentEvent);
    }
    // 4. Timeline, Schedule & Run of show
    else if (p.includes("timeline") || p.includes("schedule") || p.includes("run of show") || p.includes("hour") || p.includes("time")) {
      responseText = this.generateTimelineResponse(currentEvent);
    }
    // 5. Vendors & Questions & Contracts
    else if (p.includes("vendor") || p.includes("cater") || p.includes("photograph") || p.includes("contract") || p.includes("question")) {
      responseText = this.generateVendorResponse(p, currentEvent);
    }
    // 6. General Intelligent Planner Co-pilot
    else {
      responseText = this.generateGeneralResponse(prompt, currentEvent);
    }

    if (onChunk) {
      await this.streamText(responseText, onChunk);
    }
    return responseText;
  }

  generateThemeResponse(currentEvent) {
    if (currentEvent.type === "wedding") {
      return `### 🌸 Local Wedding Concept: "Ethereal Glasshouse Sanctuary"

**Core Narrative:** Blending natural organic flora with crisp modern glass architecture and candlelight intimacy.

#### 🎨 Recommended Harmonious Color Palette
- **Deep Forest Emerald** (\`#1B3B2B\`) — Velvet table runners and foliage backbone
- **Gilded Champagne** (\`#D4AF37\`) — Flatware, rimmed crystal, and ambient chandeliers
- **Eucalyptus Sage** (\`#87A99C\`) — Olive branch arches, stationery, bridesmaids accents
- **Alabaster Warm White** (\`#F7F5F0\`) — Flowing chiffon drapes and linen base
- **Terracotta Rose** (\`#B85D43\`) — Subtle floral pops (garden roses & dried amaranth)

#### ✨ High-Impact Design Touchpoints
1. **Hanging Canopy of Greenery**: Suspended eucalyptus garlands interspersed with Edison bulbs create an enchanted ceiling.
2. **Scent Scaping**: Infuse cedarwood, white fig, and bergamot diffusers at the entrance for an instant sensory anchor.
3. **Interactive Botanical Spritz Bar**: Guests garnish cocktails with fresh rosemary sprigs and edible viola blooms.

[BUDGET_ITEM: Decor & Florals | Suspended Edison Bulb & Foliage Trellis | 1850]
[TIMELINE_ITEM: 02:00 PM | Ambient Candle & Floral Lighting Check | Ensure zero draft blows out pillar candle glass flutes]`;
    } else if (currentEvent.type === "birthday") {
      return `### ⚡ Local Birthday Concept: "Neo-Luxe Cyberpunk Penthouse"

**Core Narrative:** High-contrast luxury mixing dark obsidian textures with electric ultraviolet and golden amber neon glow.

#### 🎨 Color Palette & Lighting
- **Cyber Ultraviolet** (\`#8A2BE2\`) — Ambient perimeter LED wash
- **Solar Amber** (\`#FF8C00\`) — Custom illuminated signage & bar underglow
- **Electric Cyan** (\`#00E5FF\`) — Laser accents and photo booth backdrops
- **Obsidian Dark** (\`#0D0F18\`) — Matte black velvet couches and bar surfaces
- **Liquid Chrome** (\`#E0E6ED\`) — Mirrored cocktail tables & balloon installations

#### 🍸 Signature Experience Elements
1. **Interactive Glow Mixology**: Smoking dry-ice cocktails served in prism crystal tumblers.
2. **360° Glitch Photo Booth**: Instant slow-mo boomerang capture with customizable neon cyberpunk overlay.
3. **Curated Synthwave Sunset Transition**: Sound shifts from ambient lo-fi to peak synth-pop as dusk falls over the city skyline.

[BUDGET_ITEM: Decor & Lighting | 3D Laser Projection & LED Tube Arrays | 850]
[TIMELINE_ITEM: 08:00 PM | Rooftop Sunset Lighting Shift | Trigger ultraviolet and neon bar illumination]`;
    } else {
      return `### 🌾 Local Community Concept: "Harvest Harmony & Heritage Grove"

**Core Narrative:** Welcoming, inclusive, multigenerational festival celebrating local makers, sustainable food, and neighborhood talents.

#### 🎨 Natural Earth Palette
- **Autumn Terracotta** (\`#C85A32\`) — Canvas pavilion headers and signage
- **Sunlit Golden Ochre** (\`#E5A93C\`) — Festival wayfinding banners and straw bale seating
- **Riverbend Pine** (\`#264639\`) — Natural woodland backdrop and volunteer vests
- **Parchment White** (\`#FDFBF7\`) — Recycled paper maps and artisan tent canopies
- **Austin Slate** (\`#2C3539\`) — High contrast typography and chalkboard menus

#### 🎪 Key Community Activations
1. **Collaborative Mosaic Tile Wall**: Every neighbor decorates a tile symbolizing "community" for a permanent park memorial.
2. **Heirloom Seed & Plant Swap**: Master gardeners host live propagation demos with free native seeds.
3. **Zero-Waste Sustainable Sorting**: Tri-stream composting and water refill stations with live environmental monitors.

[BUDGET_ITEM: Infrastructure | Zero-Waste Water Refill & Composting Hubs | 1200]
[TIMELINE_ITEM: 10:00 AM | Welcome Ribbon Cutting & Acoustic Opener | Main Stage opening fanfare]`;
    }
  }

  generateSpeechOrInviteResponse(p, currentEvent) {
    if (p.includes("invite") || p.includes("invitation")) {
      return `### 💌 Personalized Invitation Copy Draft

**Subject:** You are cordially invited to celebrate ${currentEvent.title}

*Dear friends & loved ones,*

We would be honored by your presence as we gather to celebrate **${currentEvent.title}**.

- **📅 Date:** ${currentEvent.date}
- **🕒 Time:** ${currentEvent.time}
- **📍 Location:** ${currentEvent.location}
- **👗 Dress Code:** Cocktail Elegance / Festive Botanical Chic

Join us for an unforgettable evening of live music, culinary delights, laughter, and lifelong memories under the stars.

*Please RSVP by visiting our portal or confirming before the final headcount cutoff.*

***

💡 **Pro-Tip:** Include a dietary preference field (Vegetarian, Vegan, GF, Nut allergies) directly in your digital RSVP form!`;
    }

    if (currentEvent.type === "wedding") {
      return `### 🥂 Emotional & Heartfelt Maid of Honor / Best Man Speech Draft

*(Timing: ~3 minutes | Tone: Genuine, touching, with gentle humor)*

"Good evening everyone! For those who don't know me, my name is [Name], and I have had the privilege of being by [Bride/Groom]'s side for over [X] years.

When you watch two people together, there's usually a moment where you just *know*. For Elena and Marcus, that wasn't a sudden explosion of fireworks—it was something deeper and much rarer. It was the way they immediately made everyone in the room feel welcome, the way they laugh at each other's terrible puns, and how they challenge each other to be their truest selves.

Standing in this breathtaking glasshouse tonight, surrounded by the people who love them most, you can feel the quiet strength of their partnership. 

Marcus, thank you for looking at Elena with that radiant grin that never fades. Elena, thank you for being the fiercely loyal, brilliant soul you've always been.

Let's all raise our glasses: To deep laughter, easy Sunday mornings, patient love, and a lifetime of shared adventures. To Elena and Marcus!"`;
    } else if (currentEvent.type === "birthday") {
      return `### 🎉 Milestone 30th Birthday Toast: Witty & Heartwarming

*(Timing: ~2 minutes | Tone: High-energy, playful, nostalgic)*

"Ladies and gentlemen, grab your drinks and turn your attention toward the person of the hour—Leo!

Thirty years on this planet, and Leo still approaches life like he just found the cheat codes. We've survived college all-nighters, dubious road trips, and countless tech brainstorms, but what has always remained constant is his magnetic energy and unconditional loyalty to his friends.

Turning 30 isn't about leaving your youth behind; it's about leveling up with better taste in wine, clearer priorities, and rooftop parties that look like a movie scene.

To Leo: May your code compile on the first try, your cocktails stay chilled, and your next decade be your most legendary yet. Happy 30th birthday, brother!"`;
    } else {
      return `### 🎙️ Community Opening Keynote Address

*(Timing: ~3 minutes | Tone: Inspiring, unifying, grateful)*

"Good morning, neighbors and friends! Welcome to the annual Oakridge Harvest & Arts Festival!

Looking out across Riverfront Park today, seeing families sharing picnic blankets, local artisans setting up their crafts, and the smell of fresh wood-fired ovens in the air, I am reminded of why we call this place home.

In a world that often moves too fast on screens, today is about slowing down, looking each other in the eye, and celebrating what makes our neighborhood special—our generosity, our diversity, and our shared creativity.

A huge thank you to our 40+ volunteers, city staff, and local sponsors who built this festival from the ground up. Enjoy the music, try the pie bake-off, make a new friend, and let's celebrate Oakridge together!"`;
    }
  }

  generateBudgetResponse(currentEvent) {
    const total = currentEvent.targetBudget;
    return `### 💡 Smart AI Budget Audit & High-Impact Savings

**Current Event:** ${currentEvent.title} (Target: $${total.toLocaleString()})

#### 🔍 Key Observations
1. **Primary Cost Anchor:** Venue & Catering accounts for ~65% of your total spend. This is consistent with premium event benchmarks.
2. **Buffer Health:** Recommend maintaining a strict **8% to 10% contingency reserve** ($${Math.round(total * 0.08).toLocaleString()}) for unexpected last-minute additions (overtime audio fees, weather tents, tipping).

#### 💰 4 High-Leverage Cost Optimization Strategies
- **Smart Wine/Bar Curation:** Instead of a full open top-shelf liquor bar, offer 2 craft signature cocktails + curated regional wines. This preserves premium aesthetic while reducing alcohol costs by up to **22%**.
- **Dual-Purpose Floral Arrangements:** Repurpose ceremony arch urns and aisle meadows to frame the reception sweetheart table and dessert display. Saves an estimated **$800 - $1,200**.
- **Digital Invitation Suite + Luxury Printed Menus:** Shift save-the-dates and RSVPs completely digital (saves postage and printing costs), reserving physical print only for high-tactile day-of dinner menus.
- **Off-Peak Vendor Windows:** Schedule photo coverage starting 2 hours later (focusing on Golden Hour + Reception climax rather than 5 hours of morning prep). Saves ~**$600**.

[BUDGET_ITEM: Contingency Reserve | Unforeseen Overtime & Incidentals Buffer | ${Math.round(total * 0.05)}]`;
  }

  generateTimelineResponse(currentEvent) {
    return `### ⏱️ Sample Day-of Run-of-Show & Buffer Protocol

**Event:** ${currentEvent.title} | **Date:** ${currentEvent.date}

#### 🎯 Strategic Time Buffer Rules
- **The "Rule of 15":** Add 15 minutes of phantom buffer before ceremony/doors open to absorb guest transit and parking bottlenecks.
- **Golden Hour Window:** Check exact solar sunset for ${currentEvent.date} (approx 06:15 PM) to allocate 25 minutes of undisturbed couples/VIP photography.
- **Vendor Teardown Clear Zone:** Ensure sound drops 30 minutes before venue contract expiry to prevent overtime penalty charges.

#### 📋 Suggested Schedule Additions:
- **T-Minus 90 Mins:** Audio Line Check & Wireless Microphone Frequency Scan
- **T-Minus 30 Mins:** Pre-Event VIP Green Room Gathering & Water Service
- **T-Plus 120 Mins:** Midnight Snack / Comfort Food Delivery (Keeps energy peaking)

[TIMELINE_ITEM: 02:45 PM | Wireless Mic & Sound System Frequency Check | Sound engineer tests all lapel and handheld mics]
[TIMELINE_ITEM: 09:30 PM | Late-Night Comfort Food Snack Station | Mini burgers and sweet churros brought to dance floor]`;
  }

  generateVendorResponse(prompt, currentEvent) {
    return `### 📋 Comprehensive Vendor Vetting & Negotiation Guide

When negotiating with vendors for **${currentEvent.type.toUpperCase()}** events, here are the critical clauses and questions to lock down before signing:

#### 🎯 5 Essential Questions to Ask Every Vendor:
1. **Contingency & Replacement:** *"If your primary lead or equipment fails on the event day, what is your guaranteed backup protocol?"*
2. **Overtime Rates:** *"What is the exact hourly billing rate if the celebration runs 45 minutes past the contract cutoff?"*
3. **Power & Space Requirements:** *"How many dedicated 20-amp electrical circuits and how much square footage does your setup demand?"*
4. **Deposit & Refund Terms:** *"In the unlikely event of severe weather or emergency date rescheduling, what portion of the deposit transfers?"*
5. **Insurance:** *"Can you provide a Certificate of Insurance (COI) listing the venue as an additional insured 30 days prior?"*

#### 🤝 Negotiation Tip
Offer to pay the remaining balance in full 14 days early or write a prompt featured 5-star review with professional photography in exchange for a **5-8% equipment upgrade or complimentary overtime half-hour**.`;
  }

  generateGeneralResponse(prompt, currentEvent) {
    return `### 🤖 AuraPlan AI Co-Pilot Recommendation

Based on your current plan for **${currentEvent.title}** (${currentEvent.guestCount} guests, $${currentEvent.targetBudget.toLocaleString()} budget):

Regarding: *"**${prompt}**"*

Here is the strategic recommendation:
- **Prioritize Guest Flow:** Ensure transition zones (cocktails to seating, or registration to main stage) have clear signage to prevent crowding.
- **Communication Rhythm:** Send an SMS reminder or email 48 hours prior with exact parking coordinates, dress code, and arrival timing.
- **Vendor Alignment:** Share your synchronized Run-of-Show PDF with all key vendor leads 5 business days in advance.

Would you like me to generate a tailored **checklist**, draft an **email to your team**, or calculate the **budget impact** of this idea?`;
  }

  /**
   * Smooth typing/streaming effect
   */
  async streamText(text, callback) {
    const words = text.split(" ");
    let current = "";
    const chunkSize = 4;
    for (let i = 0; i < words.length; i += chunkSize) {
      current += (i > 0 ? " " : "") + words.slice(i, i + chunkSize).join(" ");
      callback(current);
      await new Promise(r => setTimeout(r, 16));
    }
  }
}

// Global instance
window.auraAI = new AIEngine();
