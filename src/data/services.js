/**
 * All studio content lives here. Edit this file to change what is offered,
 * what it costs and how long a consultation runs.
 */

export const owner = {
  name: "Dobgima Joshua Foncham",
  shortName: "Dobgima Joshua",
  initials: "DJ",
  role: "Web & Mobile App Developer",
  title: "Web developer, app developer and digital marketer",
  phone: "670-87-46-49",
  phoneHref: "tel:+237670874649",
  email: "dobgimajoshua52@gmail.com",
  location: "Buea, Cameroon — working with clients anywhere",
  bio: "I design and build the full site myself, from the first wireframe to the live domain. One person to brief, one person accountable, no handoffs between a designer, a developer and an account manager.",
};

export const categories = [
  "All",
  "Platforms",
  "E-commerce",
  "Business",
  "Mobile",
  "Marketing",
  "Telecom",
  "Care",
];

export const services = [
  {
    id: "svc-tracking",
    name: "Tracking Platform with Live Map",
    category: "Platforms",
    icon: "PackageSearch",
    tagline: "Customers watch their delivery move on a live map",
    description:
      "A tracking site where your customers enter a reference and see exactly where their package or vehicle is on a live map, plus an admin panel where your team pushes status and location updates in seconds.",
    features: [
      "Live map showing the current position and route",
      "Public tracking page with a reference lookup",
      "Status timeline with dates, stops and locations",
      "Admin panel to create and update shipments",
      "Email or SMS notification on every status change",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
    popular: true,
  },
  {
    id: "svc-banking",
    name: "Banking System",
    category: "Platforms",
    icon: "Landmark",
    tagline: "Accounts, transfers and statements in one secure system",
    description:
      "A banking or microfinance platform where members hold accounts, move money and download statements, while your staff work from a controlled back office with every action logged.",
    features: [
      "Customer accounts with balances and transaction history",
      "Deposits, withdrawals and internal transfers",
      "Downloadable statements and receipts",
      "Staff back office with roles and permissions",
      "Full audit trail on every transaction",
    ],
    startingAt: 800,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
    popular: true,
  },
  {
    id: "svc-ecommerce",
    name: "E-commerce Store",
    category: "E-commerce",
    icon: "ShoppingBag",
    tagline: "Sell online with a store you actually control",
    description:
      "A complete online shop: product catalogue, cart, checkout and an admin area for stock and orders. Built to load fast on mobile data and to be edited by you, not by me.",
    features: [
      "Product catalogue with variants and stock levels",
      "Cart, checkout and order confirmation",
      "Mobile Money and card payment integration",
      "Orders, customers and sales dashboard",
    ],
    startingAt: 720,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
    popular: true,
  },
  {
    id: "svc-spare-parts",
    name: "Spare Parts Catalogue",
    category: "E-commerce",
    icon: "Wrench",
    tagline: "A parts store customers can search by make and model",
    description:
      "A searchable spare-parts catalogue with compatibility filters, live stock and quote requests, so buyers find the exact part instead of calling to ask.",
    features: [
      "Search and filter by make, model, year or part number",
      "Compatibility and fitment notes per part",
      "Live stock levels and supplier references",
      "Request-a-quote flow for parts not in stock",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
  },
  {
    id: "svc-pet",
    name: "Pet & Veterinary Website",
    category: "Business",
    icon: "PawPrint",
    tagline: "For clinics, groomers, breeders and pet shops",
    description:
      "A warm, trustworthy site for a pet business: services and pricing, an appointment request form, a pet gallery and everything a new client checks before calling.",
    features: [
      "Services, pricing and clinic hours",
      "Appointment or grooming request form",
      "Pet gallery and adoption or breed listings",
      "Directions, contact and emergency details",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
  },
  {
    id: "svc-restaurant",
    name: "Restaurant Website",
    category: "Business",
    icon: "UtensilsCrossed",
    tagline: "Menu, reservations and orders that reach the kitchen",
    description:
      "A site that makes people hungry and makes ordering easy: a menu you update yourself, table reservations, and takeaway orders that arrive where your staff will actually see them.",
    features: [
      "Menu with photos, prices and daily specials you edit yourself",
      "Table reservation form with confirmation",
      "Takeaway and delivery orders sent to WhatsApp or the kitchen",
      "Opening hours, location map and directions",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
  },
  {
    id: "svc-school",
    name: "School Management System",
    category: "Platforms",
    icon: "GraduationCap",
    tagline: "Students, marks, fees and report cards in one place",
    description:
      "A complete school platform: enrol students, record marks, track fee payments and print report cards, with separate logins for admin, teachers and parents.",
    features: [
      "Student records, classes and enrolment",
      "Teacher mark entry with automatic averages",
      "Report cards ready to print each term",
      "Fee tracking with balances and receipts",
      "Separate admin, teacher and parent logins",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
    popular: true,
  },
  {
    id: "svc-mobile-app",
    name: "Mobile App",
    category: "Mobile",
    icon: "Smartphone",
    tagline: "One app, on both Android and iPhone",
    description:
      "A mobile app built once and released to both stores, sharing the same backend as your website so your data stays in one place.",
    features: [
      "Android and iPhone from a single codebase",
      "Push notifications to reach users directly",
      "Works offline and syncs when back online",
      "Play Store and App Store submission handled for you",
    ],
    startingAt: 2750,
    priceMax: 10000,
    timeline: "2 – 4 weeks",
    consultMinutes: 5,
    popular: true,
  },
  {
    id: "svc-business",
    name: "Business & Portfolio Site",
    category: "Business",
    icon: "Building2",
    tagline: "The site people check before they trust you",
    description:
      "A clean, fast company or personal site that explains what you do, proves you can do it, and makes getting in touch obvious. Written and structured for search engines from day one.",
    features: [
      "Up to six pages, written and laid out with you",
      "Contact form that reaches your inbox reliably",
      "SEO basics, social preview cards and analytics",
      "Fast on slow connections, works on any phone",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
  },
  {
    id: "svc-booking",
    name: "Booking & Appointment System",
    category: "Platforms",
    icon: "CalendarClock",
    tagline: "Let clients book you without the back-and-forth",
    description:
      "A booking site like this one: your services, your real availability, instant confirmation and an admin dashboard showing every appointment on your calendar.",
    features: [
      "Live availability from your own opening hours",
      "Multi-step booking with instant confirmation",
      "Client reminders before each appointment",
      "Admin dashboard with a day-by-day schedule",
    ],
    startingAt: 250,
    withHostingXAF: 80000,
    timeline: "3 – 4 days",
    consultMinutes: 5,
  },
  {
    id: "svc-seo",
    name: "SEO",
    category: "Marketing",
    icon: "TrendingUp",
    tagline: "Get found on Google without paying for every click",
    description:
      "Ongoing search work so people looking for what you sell find you instead of a competitor: technical fixes, the right keywords, and content that earns its ranking.",
    features: [
      "Full technical audit and fixes in the first month",
      "Keyword research around what your customers actually search",
      "On-page optimisation for every important page",
      "Monthly ranking and traffic report in plain language",
    ],
    startingAt: 200,
    priceMax: 1000,
    priceSuffix: "/month",
    billing: "monthly",
    askMonths: true,
    timeline: "Results in 3 – 6 months",
    consultMinutes: 5,
    marketing: true,
  },
  {
    id: "svc-google-ads",
    name: "Google Ads Management",
    category: "Marketing",
    icon: "Megaphone",
    tagline: "Appear at the top today, and stop wasting ad budget",
    description:
      "I build and run your Google Ads campaigns — keywords, copy, targeting and budget — and cut whatever is spending money without bringing customers.",
    features: [
      "Campaign setup, keywords and ad copy written for you",
      "Conversion tracking so you see real enquiries, not just clicks",
      "Weekly optimisation of bids, budget and negative keywords",
      "Monthly report showing spend against results",
    ],
    startingAt: 443,
    priceSuffix: "/month",
    billing: "monthly",
    askMonths: true,
    note: "Your Google ad spend is paid directly to Google and is separate from this fee.",
    timeline: "Live within a week",
    consultMinutes: 5,
    marketing: true,
  },
  {
    id: "svc-ranking",
    name: "Website Ranking on Google",
    category: "Marketing",
    icon: "Search",
    tagline: "Get an existing site onto the first page",
    description:
      "A focused push to move a site you already own up the Google results: indexing fixed, pages optimised for the searches that matter, and listings submitted so Google can actually find you.",
    features: [
      "Site submitted and indexed properly on Google",
      "Target keywords chosen from what your customers search",
      "Titles, descriptions and page structure rewritten to rank",
      "Before-and-after position report so you see the movement",
    ],
    startingAt: 45,
    billing: "one-off",
    timeline: "1 – 2 weeks",
    consultMinutes: 5,
    marketing: true,
  },
  {
    id: "svc-google-business",
    name: "Google Business Profile",
    category: "Marketing",
    icon: "MapPin",
    tagline: "Show up on Google Maps when people search nearby",
    description:
      "Your business claimed, verified and properly set up on Google Maps and Search, so customers nearby can find you, call you and leave reviews.",
    features: [
      "Profile created, claimed and verified for you",
      "Categories, hours, service area and photos set up properly",
      "Review link so happy customers can rate you in one tap",
      "Walkthrough of how to post offers and reply to reviews",
    ],
    startingAt: 61,
    billing: "one-off",
    timeline: "3 – 7 days",
    consultMinutes: 5,
    marketing: true,
  },
  {
    id: "svc-esim",
    name: "Foreign Numbers & eSIM",
    category: "Telecom",
    icon: "Globe",
    tagline: "A phone number in any country, active the same day",
    description:
      "Need a US, UK, Canadian or European number to verify an account, receive business calls or travel without roaming charges? I set you up with a foreign number or eSIM on your existing phone, no second handset needed.",
    features: [
      "Numbers and eSIMs available for every country",
      "Receive calls and SMS verification codes normally",
      "Installed on your current phone alongside your local line",
      "Set up and tested with you the same day",
    ],
    startingAt: 8,
    timeline: "Same day",
    consultMinutes: 5,
  },
  {
    id: "svc-care",
    name: "Website Care & Support",
    category: "Care",
    icon: "ShieldCheck",
    tagline: "Keep a site you already own fast, safe and current",
    description:
      "Monthly care for an existing site: updates, backups, security checks, small content edits and a person who answers when something breaks.",
    features: [
      "Updates, backups and uptime monitoring",
      "Security checks and malware clean-up",
      "Content and small layout edits each month",
      "Priority response when something goes wrong",
    ],
    startingAt: 40,
    priceSuffix: "/month",
    timeline: "Ongoing",
    consultMinutes: 5,
  },
];

/**
 * The escape hatch: whatever a client needs that is not on the list above.
 * Selectable in the booking wizard like a normal service, but priced only
 * after the call.
 */
export const customService = {
  id: "svc-custom",
  name: "Something else",
  category: "Custom",
  icon: "Lightbulb",
  tagline: "Tell me what you need and I will tell you if I can build it",
  description:
    "Not everything fits a list. Describe the system you have in mind and I will tell you honestly whether I can build it, what it would take, and what it would cost.",
  features: [
    "Describe it in your own words, no technical language needed",
    "Honest answer on whether it is worth building",
    "Written quote after the call",
  ],
  startingAt: null,
  timeline: "Quoted after the call",
  consultMinutes: 5,
  custom: true,
};

export const process = [
  {
    step: "Consultation",
    text: "We get on a call. You explain the business, I ask the awkward questions, and we agree on what the site must actually do.",
  },
  {
    step: "Proposal & quote",
    text: "Within two days you get a written scope, a fixed price and a delivery date. No hourly surprises later.",
  },
  {
    step: "Design & build",
    text: "You see a working preview link early and after each milestone, so nothing is a surprise at the end.",
  },
  {
    step: "Launch & handover",
    text: "I deploy it to your domain, show you how to run it, and stay available for the first month at no extra cost.",
  },
];

/** Content for the About page. */
export const about = {
  headline: "I am Dobgima Joshua, a developer and freelancer",
  intro:
    "I build websites, web systems and mobile apps for businesses that need software to actually run something — deliveries to track, money to move, students to manage, products to sell. I work directly with the people who will use what I build, which is why most projects ship in days rather than months.",
  why: [
    {
      title: "You talk to the person building it",
      text: "No account manager relaying messages to a developer you never meet. You explain it once, to me, and I build it.",
    },
    {
      title: "Delivered in days, not months",
      text: "Most websites are live within three to four days of the brief being agreed. Larger apps take longer, and I say so up front.",
    },
    {
      title: "Priced before I start",
      text: "You get a fixed figure in writing after the consultation. No hourly billing, no invoice that grows while you wait.",
    },
    {
      title: "Built for the internet you actually have",
      text: "Everything I ship is tested on slow mobile data and small screens, because that is how most of your customers will open it.",
    },
  ],
  stack: [
    { group: "Front end", items: ["React", "Next.js", "Tailwind CSS", "JavaScript", "HTML & CSS"] },
    { group: "Back end", items: ["Node.js", "Python", "REST APIs", "Authentication & roles"] },
    { group: "Data", items: ["PostgreSQL", "Supabase", "Firebase", "MySQL"] },
    { group: "Mobile", items: ["React Native", "Flutter", "Play Store & App Store releases"] },
    { group: "Payments", items: ["Mobile Money", "Card gateways", "Invoicing & receipts"] },
    { group: "Growth", items: ["SEO", "Google Ads", "Google Business Profile", "Analytics"] },
  ],
  facts: [
    { value: "3 – 4", label: "Days to deliver a website" },
    { value: "15+", label: "Types of system I build" },
    { value: "1", label: "Person accountable — me" },
    { value: "30", label: "Days of free support after launch" },
  ],
  ways: [
    "You own the code, the domain and every account in your name",
    "A preview link from day one, so you watch it come together",
    "Handover session so your team can run it without me",
    "Reachable on WhatsApp during the build, not just by email",
  ],
};

export const guarantees = [
  {
    title: "Fixed price, agreed up front",
    text: "The quote from the consultation is the price you pay. Scope changes are quoted separately before any work starts.",
  },
  {
    title: "You own everything",
    text: "Code, domain, hosting account and content are all in your name. You are never locked in to me.",
  },
  {
    title: "Built to be edited",
    text: "Every project comes with an admin area and a short handover session, so routine changes never need a developer.",
  },
  {
    title: "One month of free support",
    text: "Bugs and fixes after launch are on me for the first 30 days. No ticket system, just message me.",
  },
];

export const faqs = [
  {
    q: "What happens on the consultation call?",
    a: "It is a quick 5 minute call. You tell me what you need, I tell you whether I can build it, roughly what it costs and how soon. Anything bigger we take to a longer call or WhatsApp afterwards.",
  },
  {
    q: "Does the consultation cost anything?",
    a: "No. The call is free and there is no obligation. You only pay once you accept a written quote.",
  },
  {
    q: "How are payments structured?",
    a: "Half up front to begin, half on delivery before the site goes live. Mobile Money and bank transfer both work.",
  },
  {
    q: "Do the prices shown include everything?",
    a: "They are honest starting points for a project of that type. Domain, hosting and any paid third-party service are billed at cost and listed separately in your quote.",
  },
  {
    q: "Is my Google ad budget included in the management fee?",
    a: "No. You pay Google directly for your ads and pay me separately to run them. That way you see exactly what goes to advertising and what goes to management, and the budget stays under your control.",
  },
  {
    q: "How soon does SEO actually work?",
    a: "Technical fixes show up in weeks, but real ranking movement takes three to six months. If you need customers this week, Google Ads is the honest answer and I will tell you so.",
  },
  {
    q: "Does a mobile app mean two separate builds?",
    a: "No. I build once and release to both Android and iPhone, so you pay for one app rather than two, and both stores stay in step.",
  },
  {
    q: "Can you take over a site someone else built?",
    a: "Yes. Send a request with a link to the current site. I will tell you plainly whether it is worth fixing or rebuilding.",
  },
  {
    q: "How do we communicate during the project?",
    a: "WhatsApp or email, whichever you prefer, plus a preview link that updates as the build progresses.",
  },
];
