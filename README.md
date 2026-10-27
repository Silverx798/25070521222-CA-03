# Mythos Atlas (神話アトラス)

> *"Every place has a story. Some should never have been told."*

**Mythos Atlas** is a full-stack, atmospheric web archive where users explore myths, urban legends, ghost stories, cryptids, haunted fortresses, folklore, and unexplained phenomena from cultures across the globe.

---

## Visual Identity & Design System

The application's visual system is defined and documented in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md), inspired by 19th-century dark romanticism, intaglio crosshatch etchings, and antique supernatural cartography:
- **Palette:** Deep abyss canvas (`#070a0f`), charcoal slate (`#121820`), illuminated antique gold (`#d4af37`), muted parchment cream (`#f5f0e6`), and spectral celadon (`#3a6369`).
- **Typography:** *Cinzel* for display headers, *Cormorant Garamond* / *Crimson Pro* for narrative reading, and *Inter* for crisp interface elements.
- **Atmosphere:** Canvas drifting fog, atmospheric particles, Framer Motion spring parallax, and opt-in synthesized ambient sound.
- **Media Provenance Rule:** Visual reference images are never reused as generic story assets. Every folklore chronicle features its own culturally authentic depiction, artist credit, and Creative Commons / Public Domain licensing metadata.

---

## Technology Stack

- **Frontend:** React.js, Vite, React Router, React Leaflet, Lucide Icons, Framer Motion, Vanilla CSS
- **Backend:** Node.js, Express.js, JWT, bcryptjs, Helmet, CORS
- **Database:** MongoDB with Mongoose ODM (GeoJSON 2dsphere indexing, text search, persistent embedded fallback in `.mongo-data`)
- **Data Ingestion Sources:** MediaWiki Action API (`en.wikipedia.org/w/api.php`) and Wikimedia Commons API (`commons.wikimedia.org/w/api.php`)

---

## Core Features & System Repairs

1. **Global Folklore Ingestion Pipeline (`npm run import:folklore`):**
   - Discovers, normalizes, deduplicates, and stores source-backed folklore entries with introductory extracts, canonical references, and geographic coordinates.
   - Populates MongoDB with **126 verified stories** across all 7 continents and 6 categories (myths, urban legends, ghost stories, cryptids, haunted places, unexplained phenomena).
   - Safe, non-destructive, and 100% idempotent reruns.
2. **Fixed Dedicated World Map (`/map`):**
   - Resolved React runtime `ReferenceError` that previously caused a blank screen.
   - Replaced CARTO endpoints with standard OpenStreetMap raster tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) with official attribution (`© OpenStreetMap contributors`) and dark cartographic styling. Zero watermarks, zero API key requirements.
   - 124 interactive map markers with category-coded pulsating pins, coordinate mapping, and slide-out story preview dossiers.
3. **Submission Form with Working Coordinate Picker (`/submit`):**
   - Uses shared OpenStreetMap tiles without watermarks.
   - Allows users to click and reposition map markers, saving GeoJSON Point `[longitude, latitude]` coordinates with pending community submissions.
4. **Authentic Story-Specific Media & Provenance Dossiers (`/stories/:slug`):**
   - Lead images fetched directly from Wikimedia Commons repositories with machine-readable metadata.
   - Each story displays a **Media Provenance Dossier** disclosing artist credit, license name (e.g. CC BY-SA 4.0), license URL, and direct link to the original Wikimedia Commons file page.
5. **Admin Moderation & Asset Diagnostics Dashboard (`/admin`):**
   - Role-guarded console for curators and archivists to inspect manuscripts, approve (publish), or reject submissions.
   - Real-time **Asset Diagnostics** reporting total stories, verification rate (100%), categorical spread, continental distribution, and duplicate image tracking.
6. **User Authentication & Collections (`/collection`):**
   - Register, login, and bookmark legends into persistent MongoDB collections.

---

## Quickstart & Local Execution

Both servers run concurrently in local development.

### 1. Backend Server
```powershell
cd server
npm.cmd install           # Installs backend dependencies
npm.cmd run import:folklore # Runs Wikipedia & Commons ingestion pipeline (populates MongoDB)
npm.cmd start             # Runs Express on http://localhost:5000
npm.cmd test              # Runs 10 automated end-to-end API tests
```

### 2. Frontend Client
```powershell
cd client
npm.cmd install
npm.cmd run dev           # Runs Vite dev server on http://localhost:5173
npm.cmd run build         # Validates production bundle build
```

Visit **`http://localhost:5173`** in your browser.

---

## Demo Credentials (Pre-seeded in MongoDB)

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Archivist (Admin)** | `admin@mythosatlas.org` | `AtlasAdmin2026!` | Full Admin Moderation Console (`/admin`), Story Publishing, Asset Diagnostics |
| **Curator (User)** | `curator@mythosatlas.org` | `Curator2026!` | Story Submission (`/submit`), Personal Collections (`/collection`) |

*(Quick-click autofill buttons are built directly into the Sign In modal).*
