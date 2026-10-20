/**
 * AuraPlan AI - Default Event Data & Templates
 * Rich presets for Weddings, Milestone Birthdays, and Community Events
 */

const DEFAULT_EVENTS = [
  {
    id: "evt-wedding-01",
    type: "wedding",
    title: "Elena & Marcus’s Botanical Glasshouse Wedding",
    tagline: "Ethereal foliage, romantic warm candlelight, and live acoustic serenade",
    date: "2026-10-24",
    time: "15:30",
    location: "Silverwood Conservatory & Gardens, Napa Valley, CA",
    guestCount: 140,
    targetBudget: 42000,
    currency: "USD",
    theme: "Modern Botanical Luxury & Golden Hour Glow",
    heroImage: "assets/wedding.jpg",
    colorPalette: [
      { name: "Forest Emerald", hex: "#1B3B2B", role: "Primary Accent" },
      { name: "Champagne Gold", hex: "#D4AF37", role: "Metallic Highlight" },
      { name: "Eucalyptus Mist", hex: "#87A99C", role: "Secondary Sage" },
      { name: "Warm Alabaster", hex: "#F7F5F0", role: "Canvas Neutral" },
      { name: "Tuscan Terracotta", hex: "#B85D43", role: "Pop Contrast" }
    ],
    budgetCategories: [
      { id: "venue", name: "Venue & Rentals", benchmarkPct: 35 },
      { id: "catering", name: "Catering & Open Bar", benchmarkPct: 30 },
      { id: "media", name: "Photo & Cinematic Video", benchmarkPct: 12 },
      { id: "music", name: "Live Band & Acoustic Ceremony", benchmarkPct: 8 },
      { id: "decor", name: "Florals & Custom Lighting", benchmarkPct: 8 },
      { id: "attire", name: "Attire, Rings & Hair/Makeup", benchmarkPct: 4 },
      { id: "misc", name: "Stationery, Favors & Contingency", benchmarkPct: 3 }
    ],
    expenses: [
      { id: "exp-1", category: "Venue & Rentals", name: "Glasshouse Conservatory Rental (12 hrs)", estimated: 12000, actual: 11500, paid: 6000, status: "Deposit Paid", due: "2026-10-01", vendor: "Silverwood Conservatory" },
      { id: "exp-2", category: "Venue & Rentals", name: "Farmhouse Tables & French Cane Chairs", estimated: 2400, actual: 2350, paid: 2350, status: "Paid", due: "2026-09-15", vendor: "Valley Event Rentals" },
      { id: "exp-3", category: "Catering & Open Bar", name: "Farm-to-Table Plated Dinner (140 pax)", estimated: 10500, actual: 10800, paid: 5400, status: "Deposit Paid", due: "2026-10-10", vendor: "Heirloom Harvest Catering" },
      { id: "exp-4", category: "Catering & Open Bar", name: "Artisanal Cocktail Bar & Napa Wines", estimated: 3200, actual: 3000, paid: 1500, status: "Deposit Paid", due: "2026-10-10", vendor: "The Spirited Botanist" },
      { id: "exp-5", category: "Photo & Cinematic Video", name: "10-Hour Photography + Drone Video Duo", estimated: 4800, actual: 4800, paid: 2400, status: "Deposit Paid", due: "2026-10-05", vendor: "Lumière Wedding Visuals" },
      { id: "exp-6", category: "Music & Entertainment", name: "Acoustic Duo (Ceremony) + 5-Piece Jazz Soul Band", estimated: 3500, actual: 3600, paid: 1800, status: "Deposit Paid", due: "2026-10-12", vendor: "Golden State Harmony" },
      { id: "exp-7", category: "Decor & Florals", name: "Hanging Foliage Canopy & White Rose Arch", estimated: 3800, actual: 3950, paid: 3950, status: "Paid", due: "2026-09-20", vendor: "Wildflower & Ivy Studios" },
      { id: "exp-8", category: "Attire, Rings & Hair/Makeup", name: "Bridal Suite HMUA (Bride + 5 Maids)", estimated: 1800, actual: 1750, paid: 500, status: "Pending", due: "2026-10-20", vendor: "Glow Artistry Collective" },
      { id: "exp-9", category: "Stationery, Favors & Contingency", name: "Pressed Wildflower Menus & Calligraphy", estimated: 650, actual: 620, paid: 620, status: "Paid", due: "2026-09-01", vendor: "Papier Studio" }
    ],
    milestones: [
      { id: "ms-1", phase: "9-12 Months Out", title: "Finalize Venue Contract & Date Booking", dueDate: "2026-01-15", owner: "Elena & Marcus", status: "done", category: "Venue" },
      { id: "ms-2", phase: "6-8 Months Out", title: "Lock in Catering Menu Tasting & Bar Selections", dueDate: "2026-04-10", owner: "Marcus", status: "done", category: "Catering" },
      { id: "ms-3", phase: "4-6 Months Out", title: "Confirm Photographer & Film Team Schedule", dueDate: "2026-06-20", owner: "Elena", status: "done", category: "Media" },
      { id: "ms-4", phase: "2-3 Months Out", title: "Send Formal Digital & Physical Invitations", dueDate: "2026-08-01", owner: "Elena", status: "done", category: "Guest Experience" },
      { id: "ms-5", phase: "1 Month Out", title: "Finalize Ceremony Seating Chart & Dietary Needs", dueDate: "2026-09-24", owner: "Wedding Coordinator", status: "in-progress", category: "Coordination" },
      { id: "ms-6", phase: "Final Week", title: "Rehearsal Dinner Walkthrough at Glasshouse", dueDate: "2026-10-23", owner: "Officiant & Party", status: "todo", category: "Ceremony" },
      { id: "ms-7", phase: "Event Day", title: "Day-of Run of Show Execution & Vendor Check-in", dueDate: "2026-10-24", owner: "Lead Coordinator", status: "todo", category: "Coordination" }
    ],
    runOfShow: [
      { time: "09:00 AM", title: "Bridal Party Hair & Makeup Begins", lead: "Glow Artistry", location: "Conservatory Bridal Suite", status: "pending", notes: "Champagne & brunch platter provided" },
      { time: "11:30 AM", title: "Groom & Groomsmen Arrival & Getting Ready", lead: "Best Man (David)", location: "Cottage Lounge", status: "pending", notes: "Boutonnières pinned at 12:15 PM" },
      { time: "01:00 PM", title: "Floral & Decor Load-In / Sound Check", lead: "Wildflower & Band Lead", location: "Main Glasshouse Pavilion", status: "pending", notes: "Check overhead fairy lights & aisle runners" },
      { time: "01:45 PM", title: "First Look & Couples Portrait Session", lead: "Lumière Visuals", location: "North Magnolia Grove", status: "pending", notes: "Private moment, 30 min golden window" },
      { time: "03:00 PM", title: "Guest Arrival & Welcome Sparkling Rosé", lead: "Venue Hostesses", location: "Sunken Garden Terrace", status: "pending", notes: "Acoustic guitar duo performs soft background" },
      { time: "03:30 PM", title: "Processional & Wedding Ceremony", lead: "Rev. Katherine Hall", location: "The Glasshouse Arch", status: "pending", notes: "Ring bearer box handed off to Best Man" },
      { time: "04:15 PM", title: "Cocktail Hour & Passed Canapés", lead: "Heirloom Harvest", location: "Veranda Courtyard", status: "pending", notes: "Family group photos on the east lawn" },
      { time: "05:45 PM", title: "Grand Entrance & First Dance", lead: "Golden State Harmony", location: "Conservatory Dance Floor", status: "pending", notes: "Song: 'Leon Bridges - Texas Sun'" },
      { time: "06:15 PM", title: "Plated Dinner & Welcome Speeches", lead: "Maid of Honor & Father", location: "Main Dining Hall", status: "pending", notes: "Catering serves wine pairings" },
      { time: "08:15 PM", title: "Cake Cutting & Dessert Table Reveal", lead: "Lead Coordinator", location: "East Pavilion", status: "pending", notes: "Acoustic transition into high-energy live band" },
      { time: "11:00 PM", title: "Sparkler Grand Exit & Shuttles Depart", lead: "Coordinator & Drivers", location: "Grand Gatehouse Drive", status: "pending", notes: "Safety bucket for used sparklers ready" }
    ],
    vendors: [
      { id: "v-1", name: "Silverwood Conservatory", category: "Venue", contactName: "Sophia Martinez", phone: "+1 (707) 555-0192", email: "events@silverwoodgardens.com", quote: 11500, depositPaid: 6000, status: "Contract Signed", rating: 5, notes: "Strict 11:30 PM amplified sound curfew. Venue provides security guard." },
      { id: "v-2", name: "Heirloom Harvest Catering", category: "Catering", contactName: "Chef Julien Ross", phone: "+1 (707) 555-3341", email: "julien@heirloomharvest.com", quote: 10800, depositPaid: 5400, status: "Deposit Paid", rating: 5, notes: "Includes 12 vegan/gluten-free tasting plates and kid menu options." },
      { id: "v-3", name: "Lumière Wedding Visuals", category: "Photography", contactName: "Chloe Dupont", phone: "+1 (415) 555-8820", email: "hello@lumierevisuals.com", quote: 4800, depositPaid: 2400, status: "Deposit Paid", rating: 5, notes: "Includes drone footage over the vineyard and teaser reel in 48 hours." },
      { id: "v-4", name: "Golden State Harmony", category: "Music", contactName: "Marcus Vance", phone: "+1 (510) 555-4912", email: "booking@gsharmonyband.com", quote: 3600, depositPaid: 1800, status: "Deposit Paid", rating: 4, notes: "Requires 2 dedicated 20A power circuits on the band riser." },
      { id: "v-5", name: "Wildflower & Ivy Studios", category: "Decor & Florals", contactName: "Brianna Lin", phone: "+1 (415) 555-6204", email: "brianna@wildflowerivy.com", quote: 3950, depositPaid: 3950, status: "Confirmed", rating: 5, notes: "Full install starting 09:00 AM on event day. Repurposes aisle urns for head table." }
    ],
    personalizedIdeas: [
      {
        title: "Botanical Cocktail Garden Station",
        category: "Food & Beverage",
        description: "An interactive herbal spritz bar where guests pluck fresh mint, rosemary, and edible pansies to infuse into their personalized gin & elderflower cocktail.",
        tags: ["Interactive", "Aesthetic", "Zero-Waste"],
        icon: "martini",
        impact: "High guest delight"
      },
      {
        title: "Vintage Audio Guestbook Telephone",
        category: "Memories",
        description: "A 1960s rotary telephone where guests pick up the receiver, hear a recorded welcome from the couple, and leave raw, emotional audio messages.",
        tags: ["Sentimental", "Retro", "Keepsake"],
        icon: "phone",
        impact: "Unforgettable memories"
      },
      {
        title: "Seed Paper Calligraphy Favors",
        category: "Favors",
        description: "Placecards printed on biodegradable wildflower seed paper. Guests take them home to plant native California wildflowers in honor of the wedding.",
        tags: ["Eco-friendly", "Custom", "Sustainable"],
        icon: "sprout",
        impact: "Zero environmental footprint"
      },
      {
        title: "Late-Night Artisanal Pizza Oven",
        category: "Catering",
        description: "At 9:45 PM, roll in a miniature mobile wood-fired pizza cart serving truffle mushroom and spicy honey pepperoni slices directly to the dance floor.",
        tags: ["Crowd-pleaser", "Late-night", "Comfort food"],
        icon: "pizza",
        impact: "Keeps dance energy peak"
      }
    ],
    aiPrompts: [
      "Suggest 3 cost-saving floral alternatives without sacrificing the lush aesthetic",
      "Draft an emotional 2-minute Maid of Honor speech celebrating Elena's warmth",
      "Write a polite vendor email asking for an updated timeline schedule",
      "What are the top 5 unexpected rainy-day contingencies for a glasshouse venue?"
    ]
  },
  {
    id: "evt-birthday-02",
    type: "birthday",
    title: "Leo’s Cyberpunk Neon Rooftop 30th Birthday",
    tagline: "Futuristic skyline vibes, synthwave soundscapes, and craft cocktail mixology",
    date: "2026-11-15",
    time: "19:30",
    location: "Aether Penthouse Skydeck, Downtown Seattle, WA",
    guestCount: 65,
    targetBudget: 9500,
    currency: "USD",
    theme: "Retro-Futuristic Neon & Velvet Chic",
    heroImage: "assets/birthday.jpg",
    colorPalette: [
      { name: "Cyber Violet", hex: "#8A2BE2", role: "Primary Glow" },
      { name: "Neon Amber", hex: "#FF8C00", role: "High-voltage Accent" },
      { name: "Electric Cyan", hex: "#00E5FF", role: "Light Beam Accent" },
      { name: "Obsidian Midnight", hex: "#0D0F18", role: "Deep Canvas" },
      { name: "Liquid Silver", hex: "#E0E6ED", role: "Metallic Trim" }
    ],
    budgetCategories: [
      { id: "venue", name: "Skydeck Venue & Bar Minimum", benchmarkPct: 42 },
      { id: "catering", name: "Molecular Gastronomy & Sliders", benchmarkPct: 24 },
      { id: "music", name: "DJ & Custom Lighting Rig", benchmarkPct: 15 },
      { id: "media", name: "Glitch Photo Booth & Video", benchmarkPct: 10 },
      { id: "decor", name: "Custom Neon Signs & Holograms", benchmarkPct: 6 },
      { id: "misc", name: "Custom Merch & Surprises", benchmarkPct: 3 }
    ],
    expenses: [
      { id: "exp-b1", category: "Skydeck Venue & Bar Minimum", name: "Aether Skydeck Rental & Staffing (5 hrs)", estimated: 3800, actual: 3800, paid: 2000, status: "Deposit Paid", due: "2026-11-01", vendor: "Aether Rooftop Hospitality" },
      { id: "exp-b2", category: "Catering & Bar", name: "Tapas, Bao Buns & Molecular Cocktails", estimated: 2200, actual: 2350, paid: 1200, status: "Deposit Paid", due: "2026-11-05", vendor: "Pulse Gastrolab" },
      { id: "exp-b3", category: "Music & Entertainment", name: "Live Synthwave & Deep House DJ Set", estimated: 1400, actual: 1400, paid: 700, status: "Deposit Paid", due: "2026-11-10", vendor: "DJ Vector (Kieran Fox)" },
      { id: "exp-b4", category: "Decor & Lighting", name: "Custom 'Leo 30 & Thriving' Neon Sign & Light Bars", estimated: 750, actual: 680, paid: 680, status: "Paid", due: "2026-10-25", vendor: "GlowLab Neon Co." },
      { id: "exp-b5", category: "Media & Photos", name: "360-Degree Video Booth + Polaroid Station", estimated: 900, actual: 950, paid: 950, status: "Paid", due: "2026-11-02", vendor: "HyperView Media" },
      { id: "exp-b6", category: "Cake & Sweets", name: "Geometric Geode Metallic Birthday Cake", estimated: 450, actual: 420, paid: 420, status: "Paid", due: "2026-11-08", vendor: "Sugar & Chrome Confections" }
    ],
    milestones: [
      { id: "ms-b1", phase: "8 Weeks Out", title: "Confirm Penthouse Rooftop & Sound Ordinance", dueDate: "2026-09-20", owner: "Leo & Planner", status: "done", category: "Venue" },
      { id: "ms-b2", phase: "5 Weeks Out", title: "Order Custom Neon Signage & Lighting Fixtures", dueDate: "2026-10-10", owner: "Planner", status: "done", category: "Decor" },
      { id: "ms-b3", phase: "3 Weeks Out", title: "Curate Signature Cocktail Names & DJ Playlist", dueDate: "2026-10-25", owner: "Leo", status: "done", category: "Music" },
      { id: "ms-b4", phase: "1 Week Out", title: "Final RSVP Headcount & VIP Bottle Service List", dueDate: "2026-11-08", owner: "Host", status: "in-progress", category: "Guests" },
      { id: "ms-b5", phase: "Party Day", title: "Skyline Sunset Load-In & Lighting Programming", dueDate: "2026-11-15", owner: "DJ & Tech Crew", status: "todo", category: "Audio/Visual" }
    ],
    runOfShow: [
      { time: "05:30 PM", title: "AV Crew Load-In & Lighting Sync", lead: "DJ Vector", location: "Penthouse DJ Deck", status: "pending", notes: "Test laser projections & LED bars" },
      { time: "07:30 PM", title: "Doors Open & Neon Welcome Cocktails", lead: "Skydeck Staff", location: "Skyline Lounge", status: "pending", notes: "Signature drink: 'Electric Violet Paloma' with glowing ice cubes" },
      { time: "08:30 PM", title: "Passed Gourmet Asian Street Food", lead: "Pulse Gastrolab", location: "Terrace Dining Area", status: "pending", notes: "Truffle bao buns, pork belly skewers, edamame dumplings" },
      { time: "09:45 PM", title: "Birthday Roast & Champagne Toast", lead: "Best Friend (Maya)", location: "Main Lounge Stage", status: "pending", notes: "Video tribute reel projected on glass wall" },
      { time: "10:00 PM", title: "Cake Sparklers & Peak Synthwave Set", lead: "DJ Vector", location: "Center Dance Deck", status: "pending", notes: "Cold-spark machines fire for drop" },
      { time: "12:30 AM", title: "Last Call & Chillout Ambient Soundscape", lead: "Bar Lead", location: "Skyline Lounge", status: "pending", notes: "Rideshare coordination for guests" }
    ],
    vendors: [
      { id: "vb-1", name: "Aether Rooftop Hospitality", category: "Venue", contactName: "Devon Chen", phone: "+1 (206) 555-9104", email: "devon@aetherskydeck.com", quote: 3800, depositPaid: 2000, status: "Contract Signed", rating: 5, notes: "Heated deck with retractable glass ceiling in case of rain." },
      { id: "vb-2", name: "Pulse Gastrolab", category: "Catering", contactName: "Samira Patel", phone: "+1 (206) 555-8271", email: "catering@pulseculinary.com", quote: 2350, depositPaid: 1200, status: "Deposit Paid", rating: 5, notes: "Includes liquid nitrogen dessert station at 10:15 PM." },
      { id: "vb-3", name: "DJ Vector", category: "Entertainment", contactName: "Kieran Fox", phone: "+1 (206) 555-3019", email: "bookings@djvector.live", quote: 1400, depositPaid: 700, status: "Deposit Paid", rating: 5, notes: "Bringing Pioneer CDJs and wireless DMX synchronized LED lighting." },
      { id: "vb-4", name: "HyperView Media", category: "Photography", contactName: "Zane Archer", phone: "+1 (206) 555-4422", email: "zane@hyperview.io", quote: 950, depositPaid: 950, status: "Confirmed", rating: 4, notes: "Instant AirDrop delivery of 360-degree high-definition clips." }
    ],
    personalizedIdeas: [
      {
        title: "Liquid Nitrogen Smoking Mocktail & Cocktail Lab",
        category: "Food & Beverage",
        description: "Cocktails chilled with food-grade liquid nitrogen, producing a misty, sci-fi cyberpunk fog cascading over the illuminated bar counter.",
        tags: ["Visual Wow", "Mixology", "Instagrammable"],
        icon: "flask",
        impact: "Viral social moments"
      },
      {
        title: "Custom Cyberpunk Arcade Cabinet",
        category: "Entertainment",
        description: "A retro arcade machine preloaded with 90s classics (Street Fighter, Pac-Man) custom-skinned with Leo's milestone memes.",
        tags: ["Interactive", "Nostalgia", "Gaming"],
        icon: "gamepad",
        impact: "Continuous guest competition"
      },
      {
        title: "Luminous LED Wristbands Synchronized to Beats",
        category: "Guest Experience",
        description: "Wearable wristbands that pulse colors in sync with the DJ's drops, turning the entire rooftop crowd into a coordinated light spectacle.",
        tags: ["High Energy", "Immersive", "Concert Vibe"],
        icon: "zap",
        impact: "Elevates party energy tenfold"
      }
    ],
    aiPrompts: [
      "Draft a funny, roasty 30th birthday speech for Leo highlighting his quirky habits",
      "Generate 5 futuristic cyberpunk signature cocktail recipes with clever names",
      "Suggest high-energy icebreaker games that don't feel cheesy for a 30th birthday",
      "Create an emergency plan for outdoor rooftop wind & sound permits"
    ]
  },
  {
    id: "evt-community-03",
    type: "community",
    title: "Oakridge Harvest & Arts Community Festival",
    tagline: "Celebrating local artisans, farm-fresh harvests, acoustic music, and neighborhood solidarity",
    date: "2026-12-05",
    time: "10:00",
    location: "Oakridge Riverfront Park & Amphitheater, Austin, TX",
    guestCount: 850,
    targetBudget: 24000,
    currency: "USD",
    theme: "Autumn Harvest, Crafts & Acoustic Community Spirit",
    heroImage: "assets/community.jpg",
    colorPalette: [
      { name: "Rustic Terracotta", hex: "#C85A32", role: "Earth Accent" },
      { name: "Golden Sunflower", hex: "#E5A93C", role: "Warm Radiance" },
      { name: "Deep River Pine", hex: "#264639", role: "Natural Backdrop" },
      { name: "Canvas Cream", hex: "#FDFBF7", role: "Clean Neutral" },
      { name: "Charcoal Slate", hex: "#2C3539", role: "Legibility Base" }
    ],
    budgetCategories: [
      { id: "permits", name: "City Permits, EMS & Security", benchmarkPct: 25 },
      { id: "stage", name: "Stage, Sound & AV Equipment", benchmarkPct: 28 },
      { id: "infrastructure", name: "Tents, Tables, Waste & Sanitation", benchmarkPct: 22 },
      { id: "marketing", name: "Community Outreach & Signage", benchmarkPct: 12 },
      { id: "artists", name: "Honorariums & Children's Activities", benchmarkPct: 10 },
      { id: "misc", name: "Volunteer Hospitality & Contingency", benchmarkPct: 3 }
    ],
    expenses: [
      { id: "exp-c1", category: "Permits, EMS & Security", name: "City Park Special Event Permit & Traffic Control", estimated: 3200, actual: 3100, paid: 3100, status: "Paid", due: "2026-10-01", vendor: "City Parks & Recreation" },
      { id: "exp-c2", category: "Permits, EMS & Security", name: "On-site EMT First Aid Tent & Dedicated Officers", estimated: 2400, actual: 2400, paid: 1200, status: "Deposit Paid", due: "2026-11-20", vendor: "Lone Star Event Safety Services" },
      { id: "exp-c3", category: "Stage, Sound & AV Equipment", name: "Amphitheater Sound System, Mics & Sound Engineer", estimated: 5500, actual: 5200, paid: 2600, status: "Deposit Paid", due: "2026-11-15", vendor: "Austin Live Audio Group" },
      { id: "exp-c4", category: "Tents, Tables, Waste & Sanitation", name: "30 Commercial White Tents & 60 Picnic Tables", estimated: 4200, actual: 4400, paid: 2200, status: "Deposit Paid", due: "2026-11-10", vendor: "Hill Country Structures" },
      { id: "exp-c5", category: "Tents, Tables, Waste & Sanitation", name: "Eco-Friendly Composting Stations & Portable Restrooms", estimated: 2800, actual: 2650, paid: 1325, status: "Deposit Paid", due: "2026-11-25", vendor: "GreenCycle Waste Solutions" },
      { id: "exp-c6", category: "Marketing & Signage", name: "Directional Wayfinding Banners & Neighborhood Flyers", estimated: 1600, actual: 1450, paid: 1450, status: "Paid", due: "2026-10-20", vendor: "PrintCraft Community Press" },
      { id: "exp-c7", category: "Artists & Children Activities", name: "Kids Pottery Workshop & Face Painting Artists", estimated: 1800, actual: 1700, paid: 850, status: "Deposit Paid", due: "2026-11-28", vendor: "Creative Youth Alliance" }
    ],
    milestones: [
      { id: "ms-c1", phase: "12 Weeks Out", title: "Submit City Park Permit & Public Safety Blueprint", dueDate: "2026-09-10", owner: "Community Board", status: "done", category: "Permits" },
      { id: "ms-c2", phase: "8 Weeks Out", title: "Open Vendor Applications for Local Food & Crafts", dueDate: "2026-10-05", owner: "Vendor Lead (Rosa)", status: "done", category: "Vendors" },
      { id: "ms-c3", phase: "5 Weeks Out", title: "Recruit & Organize 40 Community Volunteers", dueDate: "2026-10-28", owner: "Volunteer Coord", status: "in-progress", category: "Volunteers" },
      { id: "ms-c4", phase: "2 Weeks Out", title: "Conduct Safety Walkthrough with Fire Marshal", dueDate: "2026-11-20", owner: "Logistics Director", status: "todo", category: "Safety" },
      { id: "ms-c5", phase: "Event Day", title: "Dawn Setup, Food Truck Staging & Gates Open", dueDate: "2026-12-05", owner: "Incident Command Team", status: "todo", category: "Operations" }
    ],
    runOfShow: [
      { time: "06:30 AM", title: "Logistics Team & Fire Marshal Site Inspection", lead: "Logistics Director", location: "Park Entrance A", status: "pending", notes: "Verify power drops & hydrant clear zones" },
      { time: "07:15 AM", title: "Artisan & Food Truck Staggered Load-In", lead: "Rosa & Marshals", location: "Artisan Alley & Food Truck Row", status: "pending", notes: "Strict 10 MPH speed limit inside park grounds" },
      { time: "09:00 AM", title: "Volunteer Morning Briefing & Radio Check", lead: "Volunteer Coord", location: "Pavilion Information Tent", status: "pending", notes: "Hand out color-coded lanyards & safety vests" },
      { time: "10:00 AM", title: "Gates Open & Farmers Market Commences", lead: "Master of Ceremonies", location: "Entire Park", status: "pending", notes: "Welcome address broadcast over main sound" },
      { time: "11:30 AM", title: "Youth Symphony & Acoustic Folk Performance", lead: "Austin Youth Orchestra", location: "Amphitheater Stage", status: "pending", notes: "Family seating on grassy hill" },
      { time: "01:30 PM", title: "Community Pie Bake-Off & Mayor's Citation", lead: "Mayor & Judging Panel", location: "Culinary Pavilion", status: "pending", notes: "Trophies awarded for 1st, 2nd, 3rd place" },
      { time: "03:30 PM", title: "Headliner Indie Folk Band: 'Riverbend Revival'", lead: "Stage Sound Lead", location: "Main Stage", status: "pending", notes: "Peak attendance anticipated" },
      { time: "05:30 PM", title: "Vendor Teardown & Leave-No-Trace Clean-up", lead: "GreenCycle Team", location: "All Zones", status: "pending", notes: "Volunteers conduct systematic trash sweep" }
    ],
    vendors: [
      { id: "vc-1", name: "Lone Star Event Safety Services", category: "Permits & Safety", contactName: "Captain Ray Vance", phone: "+1 (512) 555-7001", email: "operations@lonestarsafety.org", quote: 2400, depositPaid: 1200, status: "Contract Signed", rating: 5, notes: "Provides 1 certified EMT, 2 paramedics, and mobile defibrillator cart." },
      { id: "vc-2", name: "Austin Live Audio Group", category: "Audio/Visual", contactName: "Travis Miller", phone: "+1 (512) 555-8839", email: "travis@austinliveaudio.com", quote: 5200, depositPaid: 2600, status: "Deposit Paid", rating: 5, notes: "Delivering line-array speakers, 8 wireless mics, and diesel generator." },
      { id: "vc-3", name: "Hill Country Structures", category: "Rentals", contactName: "Brenda Cruz", phone: "+1 (512) 555-3211", email: "rentals@hillcountrytents.com", quote: 4400, depositPaid: 2200, status: "Deposit Paid", rating: 4, notes: "Water barrels required for anchoring on asphalt sections." },
      { id: "vc-4", name: "GreenCycle Waste Solutions", category: "Sanitation", contactName: "Alan Foster", phone: "+1 (512) 555-9430", email: "alan@greencycleaustin.org", quote: 2650, depositPaid: 1325, status: "Deposit Paid", rating: 5, notes: "Zero-landfill guarantee. 10 three-stream sorting stations with monitors." }
    ],
    personalizedIdeas: [
      {
        title: "Community Mosaic Wall Workshop",
        category: "Community Engagement",
        description: "A collaborative 12-foot mural where community members of all ages paint small wooden tiles reflecting what neighborhood means to them, permanently installed in the community center.",
        tags: ["Art", "Inclusive", "Permanent Legacy"],
        icon: "palette",
        impact: "Generational bonding"
      },
      {
        title: "Seedling & Plant Swap Tent",
        category: "Sustainability",
        description: "Neighbors bring heirloom seeds, cuttings, and starter plants to trade alongside free workshops taught by master gardeners on drought-tolerant landscaping.",
        tags: ["Eco-friendly", "Education", "Gardening"],
        icon: "leaf",
        impact: "Promotes local green spaces"
      },
      {
        title: "Local Storytelling & History Booth",
        category: "Culture",
        description: "A pop-up soundproof recording yurt where high school students interview senior neighborhood residents about historical town memories for the local historical archive.",
        tags: ["Oral History", "Youth-Senior", "Cultural"],
        icon: "mic",
        impact: "Preserves community heritage"
      }
    ],
    aiPrompts: [
      "Draft a 3-minute opening welcome speech for the festival board president",
      "Generate an emergency severe-weather plan and crowd evacuation checklist",
      "Suggest 5 engaging corporate sponsorship packages for local small businesses",
      "Write an exciting social media caption series to drive attendance"
    ]
  }
];

// Helper to get benchmark allocations for event types
const BENCHMARK_TEMPLATES = {
  wedding: [
    { name: "Venue & Rentals", pct: 35 },
    { name: "Catering & Open Bar", pct: 30 },
    { name: "Photo & Cinema", pct: 12 },
    { name: "Music & Entertainment", pct: 8 },
    { name: "Florals & Decor", pct: 8 },
    { name: "Attire & Beauty", pct: 4 },
    { name: "Stationery & Favors", pct: 3 }
  ],
  birthday: [
    { name: "Venue & Bar Minimum", pct: 40 },
    { name: "Food & Sweet Treats", pct: 25 },
    { name: "DJ, Lighting & Sound", pct: 15 },
    { name: "Photography & Photo Booth", pct: 10 },
    { name: "Decor, Signs & Balloons", pct: 6 },
    { name: "Merch, Favors & Surprises", pct: 4 }
  ],
  community: [
    { name: "Permits, EMS & Public Safety", pct: 25 },
    { name: "Stage, Audio & Production", pct: 25 },
    { name: "Tents, Sanitation & Seating", pct: 25 },
    { name: "Signage, Marketing & Badges", pct: 12 },
    { name: "Performers & Activities", pct: 10 },
    { name: "Volunteer Care & Contingency", pct: 3 }
  ]
};
