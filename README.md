# EcoVolt ⚡ | Ola & Tesla EV Awareness Website

EcoVolt is a modern, responsive, startup-grade web platform designed to educate users about electric vehicles and provide personalized carbon offsets and expense trackers.

### 🌐 Live Deployment
The project is hosted live on Vercel:
👉 **[https://ev-awareness-startup.vercel.app](https://ev-awareness-startup.vercel.app)**

---

## 🚀 Key Features
- **Ola & Tesla Integrated Fleet**: Detailed tech specs, pricing, and charge configurations for the **Ola S1 Pro Gen 2** scooter, **Ola Roadster Pro** motorcycle, **Tesla Model 3**, **Tesla Model Y**, **Tesla Cybertruck**, and **Tesla Roadster 2.0**.
- **Interactive Projections Graph (Chart.js)**: A dynamic, responsive graph in the dashboard plotting 5-year travel expenses (Gasoline Costs vs. EV Charging Costs) based on user favorites.
- **SaaS-Grade Savings Calculator**: Live sliders for distance, gas rates, MPG, and utility electricity that compute annual cash savings and CO2 offsets instantly.
- **EV Matchmaker Wizard**: A step-by-step questionnaire that aligns budget limits, distance routines, and grid access to suggest BEV or PHEV categories.
- **Interactive Map Widget**: Embedded OpenStreetMap showing simulated headquarters coordinates in San Francisco.
- **Floating Navigation Capsule**: Sticky capsule navbar with saturation blurs and active page borders.
- **Floating Form Controls**: Centered split-screen authentication forms with custom floating inputs.
- **Skeleton Loaders**: Pulsing gray loaders on catalog filtering to mimic real-world async data fetching.

---

## 🛠️ Technology Stack
- **HTML5**: Semantic tags and responsive nodes.
- **Tailwind CSS (CDN)**: Modern layout elements, chips, cards, and transitions.
- **Bootstrap CSS & JS (v5.3.x CDN)**: Grid structures, modals, collapse plugins, and dropdowns.
- **Vanilla JavaScript (ES6)**: Modular logic files syncing variables with browser `localStorage`.
- **Chart.js (CDN)**: Graphical projections and canvas tools.

---

## 📂 Project Structure
```
├── assets/
│   ├── css/
│   │   └── style.css          # Design system, variables, floating inputs, skeletons
│   ├── js/
│   │   ├── main.js            # Theme toggle, capsule nav, dynamic headers/footers
│   │   ├── auth.js            # Form validations, password checkers, session logic
│   │   ├── models.js          # Catalog database, filters, spec modals, skeleton triggers
│   │   └── dashboard.js       # Chart.js projections, profile recommendation engines
│   └── images/
│       └── hero-ev.png        # Futuristic EV background banner asset
├── index.html                 # Home Page (staggered benefits, trust logos)
├── info.html                  # EV Powertrains (live sliding calculator)
├── policies.html              # Policies & Incentives (state selectors)
├── models.html                # Vehicle Catalog (search/sort grids)
├── resources.html             # Support FAQs & Buying wizard
├── login.html / signin.html   # Access Portals (split form screens)
├── signup.html                # Register Portal (strength progress indicators)
├── dashboard.html             # Personal Analytics (expenses graph canvas)
├── contact.html               # Feedback form & map widget
└── README.md                  # Project documentation
```

---

## 💻 Running Locally
Since this is a static project, you can run it directly:
1. Clone the repository:
   ```bash
   git clone https://github.com/AnujGupta45/ElectricalVehiclesAwarenessWebsite.git
   ```
2. Double-click `index.html` to open the home page in your browser.
3. Alternatively, host it on a local server (e.g. using VS Code's Live Server or Python `python -m http.server 8000`).
