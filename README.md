# 🌌 VOID.CONSOLE

> **Advanced NASA Mission Control Dashboard**
>
> A highly interactive, sci-fi styled interface for monitoring real-time space telemetry, planetary defense systems, and deep space exploration data. Powered by NASA Open APIs.

![License](https://img.shields.io/badge/license-MIT-cyan.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)
![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)

---

## 🚀 Features

### 📡 Core Modules
- **Mission Dashboard:** Central command hub with real-time threat levels, radar, and logs.
- **Visual Feed (APOD):** Daily imagery from deep space with archival access.
- **Telemetry (NEO):** Detailed tracking of Near Earth Objects (Asteroids) with hazardous classification.
- **Mars Uplink:** Direct connection to rovers (Curiosity, Perseverance, Spirit, Opportunity).
- **Solar Defense:** Monitoring of Solar Flares and Geomagnetic Storms (DONKI).
- **Planetary Ops:** Earth observation via DSCOVR satellite (EPIC) and natural event tracking (EONET).

### 🛠 System Capabilities
- **Personal Archive:** Save and organize critical mission data (photos, telemetry) to your secure vault.
- **System Logs:** Real-time console logging of application events.
- **Onboarding:** Interactive "System Orientation Sequence" (Joyride).
- **Responsive HUD:** Fully responsive sci-fi interface with CRT effects and animations.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Data Fetching:** TanStack Query (React Query)
- **Visualization:** Visx (Radar charts)
- **Backend / Auth:** Supabase (PostgreSQL, Auth)
- **APIs:** NASA Open APIs (NeoWs, APOD, MRP, DONKI, EPIC, EONET)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- NPM or Yarn
- Supabase Account
- NASA API Key (Optional, defaults to DEMO_KEY)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/void-console.git
cd void-console
```

### 2. Install Dependencies
```bash
cd frontend/void-console
npm install
```

### 3. Environment Configuration
Create a `.env` file in `frontend/void-console/`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_NASA_API_KEY=your_nasa_api_key_here
```
> Get your NASA API Key at [api.nasa.gov](https://api.nasa.gov/).

### 4. Supabase Setup (Database)
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Run the initialization scripts found in `backend/sql/`:
   - First, run the content of `init_schema.sql` (Creates tables, profiles, policies).
   - Then, run `update_favorites.sql` (Enables saving Mars/Solar data).

### 5. Launch Mission
```bash
npm run dev
```
Access the console at `http://localhost:5173`.

---

## 🗄️ Database Schema (Supabase)

### `profiles`
Extends the default auth user table.
- `id`: UUID (Foreign Key)
- `username`: Text
- `settings`: JSONB

### `favorites`
Stores user-archived data.
- `id`: UUID
- `user_id`: UUID
- `type`: Enum (APOD, NEO, MARS, EARTH, SOLAR)
- `metadata`: JSONB (Stores specific data like image URLs, dates, titles)

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p><i>"Exploration is in our nature. We began as wanderers, and we are wanderers still."</i></p>
  <p><b>VOID.CONSOLE SYSTEMS // ONLINE</b></p>
</div>
