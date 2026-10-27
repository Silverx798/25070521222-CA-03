# Mythos Atlas — Master Specification & Architectural Blueprint

**Project Title:** Mythos Atlas  
**Project Type:** Interactive Global Folklore, Mythological, and Paranormal Archive  
**Target Environment:** Local Development (Windows / Node.js runtime)  
**Specification Version:** 1.0.0 (Master Blueprint)

---

## 1. Project Vision & Core Objectives

**Mythos Atlas** is a global, interactive digital archive where users explore legends, supernatural beliefs, folklore, ghost stories, cryptids, haunted locations, and unexplained phenomena from cultures across the globe.

### Key Objectives:
- **Atmospheric Discovery:** Transport the user into an enigmatic, dark, antique world celebrating global folklore (e.g., the Algonquin Wendigo, Japanese Kuchisake-onna, Sleepy Hollow's Headless Horseman, the Bhangarh Fort of India, Scotland's Loch Ness Monster, the Bermuda Triangle, and ancient world mythologies).
- **Interactive Cartography:** Geographically explore phenomena on an interactive, clustered world map with custom dark cartographic styling and accurate or approximate location markers.
- **Genuine Full-Stack Data Lifecycle:** All folklore content, bookmarks, submissions, and moderation states are persisted in MongoDB via a Node.js/Express REST API and consumed dynamically by a responsive React (Vite) client.
- **Community & Moderation:** Enable registered users to bookmark legends and submit local folklore with interactive coordinate pinning, routed through a server-enforced admin review and approval queue before public release.
- **Living Illustrated Atmosphere:** Bring creatures and places to life with multi-layered parallax interaction (e.g. Wendigo with interactive parallax, glowing eyes, and drifting mist), canvas-based drifting fog, and atmospheric particles.

---

## 2. Art Style & Visual Identity

Mythos Atlas follows a **Gothic Antiquarian & Ancient Museum** visual aesthetic: an explorer's supernatural cartography atlas combined with an illustrated esoteric encyclopedia.

### Visual Reference Inspirations:
- **Folklore Archive Interface:** Museum editorial aesthetics ([Asian Civilization Museum Archive](https://www.design-rhein-waal.de/asian-civilization-museum-1-1))
- **Cinematic Misty Forest:** Atmospheric depth, volumetric taiga mist, and silhouettes ([Surreal Eerie Forest](https://us.idyllic.app/gen/surreal-eerie-forest-309496?highlighted=1086088))
- **Wendigo Illustration:** Etched woodcut creature depiction with bone & antler motifs ([Wendigo Etching](https://www.etsy.com/listing/1699431763/wendigo))
- **Japanese Urban Legend:** Haunting Edo/modern ink linework ([Japanese Urban Legends](https://vocal.media/horror/three-chilling-urban-legends-of-japan-where-myth-meets-modern-fear))
- **Gothic Haunted Architecture:** Weathered stone citadels and arched ruins ([Gothic Architecture](https://easy-peasy.ai/ai-image-generator/images/example-a-mystery-and-8d99d489-d853-4300-983c-29920f9c26bd))
- **Antique Fantasy Cartography:** Aged parchment borders, wind-roses, and cartographic filigree ([Vintage Cartography](https://www.publicdomainpictures.net/en/view-image.php?image=771775&picture=vintage-fantasy-map))

### Color Palette & Visual Tokens:
- **Midnight Navy & Void:** `#070a0f` to `#0a1017` (Deep atmospheric abyss)
- **Charcoal Slate:** `#121820` / `rgba(18, 25, 33, 0.85)` (Glassmorphic cards and surfaces)
- **Illuminated Antique Gold:** `#d4af37` / `#c5a059` / `#ecd177` (Primary accent & gilded borders)
- **Muted Cream & Bone:** `#f5f0e6` / `#e2ded4` (Legible parchment text and typographic hierarchy)
- **Desaturated Teal & Celadon:** `#3a6369` / `#4c8283` (Haunted waters, moss, and spectral mists)
- **Warning & Blood Wax:** `#942b32` (Crimson ritual wax & archive seals)

### Typography Hierarchy:
- **Primary Titles & Display:** *Cinzel* (Antiquarian classical serif)
- **Literary Excerpts & Epigraphs:** *Cormorant Garamond* (Elegant editorial serif)
- **Navigation, Body, Forms & Metadata:** *Inter* (Humanist sans-serif for optimal readability and contrast)

---

## 3. Mandatory Technology Stack

| Layer | Technology | Version / Tooling | Role & Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js (v18+) | Vite, JSX | Single-Page Application user interface |
| **Routing** | React Router | `react-router-dom` (v6+) | Client-side page navigation & parameter handling |
| **Animation & Motion** | Framer Motion + CSS | `framer-motion` | Reusable layered parallax, spring physics, page transitions |
| **Interactive Map** | Leaflet & React-Leaflet | OpenStreetMap Raster (Dark CSS) | World map exploration, category markers, geographic filtering |
| **Styling** | Vanilla CSS + CSS Modules | Custom design tokens | Museum glassmorphism, responsive grids, canvas fog/particles |
| **Backend** | Node.js | Express.js (v4+) | REST API services, auth middleware, file/asset delivery |
| **Database** | MongoDB | Mongoose ODM (v8+) | Schema enforcement, validation, indexing, and persistence |
| **Auth & Security** | JWT / bcryptjs | Cookies / Bearer headers | Secure user registration, authentication, and role authorization |
| **Testing** | Node.js Native Test Runner | Supertest / HTTP assertions | Validation of backend endpoints, auth flows, and schemas |

---

## 4. Website Architecture & Pages

### 1. Home / Cinematic Landing Page
- **Hero Section:** Centered banner with animated drifting fog, starfield/celestial vortex, and primary headline:
  > *"Every place has a story. Some should never have been told."*
- Prominent dynamic search bar searching titles, categories, countries, and tags.
- Direct quick-links: `Explore the Archive` and `Enter the World Map`.
- **Featured Stories Carousel / Grid:** Highlighted entries (Wendigo, Loch Ness, Kuchisake-onna, Bhangarh Fort) with direct links.
- **Popular Right Now:** Real-time popularity ranked by actual database view counts and bookmarks.
- **Explore by Category:** Distinctive visual entry portals:
  - *Myths & Ancient Legends*
  - *Urban Legends*
  - *Ghost Stories*
  - *Cryptids & Mysterious Creatures*
  - *Haunted Places*
  - *Unexplained Phenomena*
- **Discover by Region:** Continental portals (Asia, Europe, Africa, North America, South America, Oceania).
- **Recently Added:** Latest approved stories from community & editorial curators.
- **Antiquarian Footer:** Legal, editorial policy, source citations, and navigation links.

### 2. Explore Archive (`/explore`)
- Multi-faceted filter panel: Category, Continent, Country, Region, Origin, Historical Period, and Sort (Popular, Recent, Alphabetical).
- Dynamic search synchronized with backend query parameters.
- Responsive card grid with hover depth, category badges, and pagination.

### 3. Countries & Regions Explorer (`/regions`)
- Hierarchical drill-down: Continent $\rightarrow$ Country $\rightarrow$ Region/State.
- Dedicated Country Folklore Overview: Historical context, local folklore traditions, haunted spots, regional cryptids, and associated story map.

### 4. Interactive World Map (`/map`)
- Fullscreen/large interactive Leaflet world map with CartoDB Dark Matter cartography.
- Distinctive category pin icons (Haunted Castle, Cryptid Beast, Spectral Apparition, Ancient Obelisk).
- Marker clustering for dense geographical regions.
- Interactive slide-out or floating Story Preview Panel with thumbnail, category, summary, coordinates, and full story navigation.
- Category filters, reset-view, and search synchronized directly on the map.

### 5. Individual Story Page (`/stories/:slug`)
- Cinematic hero header with title, category, geographical tag, and origin community attribution.
- Interactive layered creature illustration for flagship entries (e.g. Wendigo with pointer-tracking parallax, glowing eyes, and ambient mist layers).
- Structured narrative sections: Origins, Cultural Significance, Documented Variations, and Source References.
- Interactive mini-map showing exact or approximate legend coordinates.
- Bookmark toggle button with state persistence in MongoDB.
- Related legends from the same region or mythological category.

### 6. Submit a Story (`/submit`)
- Authenticated submission form: Title, Category, Continent, Country, Region, Approximate/Exact Location toggle, interactive map location picker, Short Summary, Full Lore Body, Cultural Origins, Reference Sources, Image URL.
- Submissions saved with status: `pending`.
- Confirmation notice explaining moderation review policy.

### 7. Authentication & User Profile (`/login`, `/register`, `/profile`)
- Secure registration and login with input validation.
- User Profile: Display name, join date, list of personal bookmarks, and personal story submissions with review status badges (`pending`, `published`, `changes_requested`, `rejected`).

### 8. Admin & Moderation Dashboard (`/admin`)
- Server-guarded route accessible only to users with role `admin` or `moderator`.
- Tabular queue of pending submissions with full detail preview.
- Actions: **Approve** (marks `published` and publishes to public API/map), **Reject**, or **Request Changes**.
- Moderation of reported content.

---

## 5. Database Schema Specifications

### `User` Collection
- `_id`: ObjectId
- `displayName`: String (required, trimmed, 2-50 chars)
- `email`: String (required, unique, lowercase, indexed)
- `passwordHash`: String (required, bcrypt salt & hash)
- `role`: String (enum: `['user', 'moderator', 'admin']`, default: `'user'`)
- `avatarUrl`: String (optional)
- `createdAt`: Date
- `updatedAt`: Date

### `Story` Collection
- `_id`: ObjectId
- `title`: String (required, trimmed, index: text)
- `slug`: String (required, unique, slugified index)
- `summary`: String (required, max 400 chars)
- `body`: String (required, long-form lore/markdown)
- `category`: String (enum: `['myths-legends', 'urban-legends', 'ghost-stories', 'cryptids', 'haunted-places', 'unexplained-phenomena']`, indexed)
- `continent`: String (enum: `['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica']`, indexed)
- `country`: String (required, indexed)
- `region`: String (optional province/state)
- `originCommunity`: String (cultural tradition, e.g., "Algonquian Indigenous Peoples")
- `historicalPeriod`: String (e.g. "Pre-Columbian", "19th Century", "Edo Period")
- `location`:
  - `type`: String (default: `'Point'`)
  - `coordinates`: [Number] (Longitude, Latitude; indexed with `2dsphere`)
- `locationIsApproximate`: Boolean (default: false)
- `tags`: [String] (index: text)
- `heroImage`:
  - `url`: String (required)
  - `alt`: String
  - `credit`: String
- `gallery`: [{ url: String, caption: String }]
- `visualEffect`: String (enum: `['wendigo-parallax', 'spectral-glow', 'flickering-lantern', 'abyssal-vortex', 'standard']`, default: `'standard'`)
- `sources`: [{ title: String, url: String }]
- `status`: String (enum: `['pending', 'published', 'rejected', 'changes-requested']`, default: `'pending'`, indexed)
- `featured`: Boolean (default: false, indexed)
- `viewCount`: Number (default: 0)
- `createdBy`: ObjectId (ref: `'User'`)
- `reviewedBy`: ObjectId (ref: `'User'`)
- `reviewedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

### `Bookmark` Collection
- `_id`: ObjectId
- `userId`: ObjectId (ref: `'User'`, required, indexed)
- `storyId`: ObjectId (ref: `'Story'`, required, indexed)
- `createdAt`: Date
- *Compound unique index:* `{ userId: 1, storyId: 1 }`

### `Report` Collection
- `_id`: ObjectId
- `storyId`: ObjectId (ref: `'Story'`, required)
- `reportedBy`: ObjectId (ref: `'User'`)
- `reason`: String (required)
- `details`: String
- `status`: String (enum: `['pending', 'resolved', 'dismissed']`, default: `'pending'`)
- `reviewedBy`: ObjectId (ref: `'User'`)
- `createdAt`: Date

---

## 6. REST API Endpoints

### Public Endpoints (`/api`)
- `GET /api/stories`: List published stories (supports `category`, `continent`, `country`, `search`, `sort`, `page`, `limit`)
- `GET /api/stories/featured`: Retrieve curated featured stories
- `GET /api/stories/popular`: Retrieve top stories by view/bookmark count
- `GET /api/stories/recent`: Retrieve most recently published stories
- `GET /api/stories/map`: Lightweight coordinates & metadata for Leaflet map markers
- `GET /api/stories/:slug`: Retrieve full story by slug (increments view count)
- `GET /api/regions`: Summary list of continents and countries with story counts
- `GET /api/search?q=...`: Search published stories across title, tags, and summary

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register`: Create account (`displayName`, `email`, `password`)
- `POST /api/auth/login`: Authenticate and receive JWT token
- `POST /api/auth/logout`: Invalidate session
- `GET /api/auth/me`: Get current authenticated user profile

### User Endpoints (`/api/me`)
- `GET /api/me`: Get profile details
- `PATCH /api/me`: Update display name or preferences
- `GET /api/me/submissions`: Get user's submitted stories and review status
- `GET /api/me/bookmarks`: Get user's saved stories
- `POST /api/stories/:id/bookmark`: Add story to user bookmarks
- `DELETE /api/stories/:id/bookmark`: Remove story from user bookmarks
- `POST /api/submissions`: Create pending story submission

### Moderation & Diagnostics Endpoints (`/api/admin`)
- `GET /api/admin/submissions`: List pending/unapproved stories
- `PATCH /api/admin/submissions/:id`: Update status (`published`, `rejected`, `changes-requested`)
- `GET /api/admin/reports`: View flagged stories
- `PATCH /api/admin/reports/:id`: Resolve or dismiss report
- `GET /api/admin/diagnostics`: Asset verification metrics, category and continental distribution


---

## 7. Quality, Performance & Security Standards

1. **Security:**
   - Password hashing with `bcryptjs` (work factor 10+).
   - JWT tokens signed with secure server secret.
   - Server-side role checks (`requireAdmin`, `requireAuth`).
   - Rate limiting on authentication and submission endpoints.
   - CORS policy configured for client origin.
   - Comprehensive input sanitization.
2. **Accessibility & Responsive Design:**
   - Dark mode default with high-contrast text and readable serif/sans pairings.
   - Respects `prefers-reduced-motion` media queries by disabling canvas particle motion and parallax tracking.
   - Fully fluid layout for mobile (320px+), tablet, and desktop (1440px+).
3. **Graceful Local Fallback:**
   - System connects seamlessly to local MongoDB or MongoDB Atlas URI via `MONGODB_URI` environment variable, with an automated rich in-memory / fallback data seeder if MongoDB daemon is initializing.
