# 🦾 Fitness Tracker SaaS — V3 (The Ultimate Edition)

Welcome to the repository for **Fitness Tracker SaaS**, a radically focused, highly gamified, and data-driven workout tracking platform. 

Initially engineered as a student CRUD prototype, the platform has been massively scaled into an enterprise-grade web application. It features a strict **Cyber-Athletic** aesthetic (stark high-contrast dark mode with neon accents), scientifically accurate biomechanical computations, and a robust multiplayer gamification engine.

---

## ✨ Core Features

### 🏋️♂️ Dynamic Hypertrophy & Cardio Engine
* **Intelligent Logging:** The UI automatically adapts input parameters based on the targeted exercise (e.g., Cardio requires `Duration`, while Strength training requests `Sets`, `Reps`, and `Weight Lifted`).
* **Real-Time Telemetry:** The backend algorithm parses scientific **MET (Metabolic Equivalent of Task)** coefficients against the user's physiological data to accurately estimate caloric burn. Training volume is computed on the fly.
* **Pre-Seeded Catalog:** Comes equipped with a relational database of over 25 precise biomechanical movements, categorized by target muscle groups and difficulty.

### 🧬 Cyber-Anatomy Heatmap
* **Visual Diagnostics:** An algorithmic engine analyzes your past week's training volume and dynamically updates an anatomical SVG dashboard.
* **Targeted Recovery:** Highlights overworked muscle groups in real-time, allowing users to visually identify neglected areas of their physique without digging through charts.

### 🕹️ Multiplayer Gamification
* **Global Leaderboards:** Secure backend polling pitches users against one another by calculating total XP accumulated from workout consistency and density.
* **Automated Ranking:** Users automatically scale through competitive tiers (Iron, Bronze, Silver, Gold) based on historical performance.
* **Privacy-First Design:** Implements automatic cryptographic email-masking on all public-facing leaderboards.

### ⚡ One-Click Routines
* **High-Speed Logging:** Bypass tedious form filling with quick templates (e.g., "Push Day", "Pull Day"). 
* **Bulk Deployment:** Click once to deploy an entire multi-movement routine instantly into your logbook, utilizing optimized SQL bulk-inserts and Optimistic UI rendering.

### 🔐 Enterprise Architecture
* **Stateless JWT Authentication:** Moving away from primitive PHP sessions, the application leverages highly secure, time-based JSON Web Tokens intercepted and injected dynamically via Axios pipelines.
* **Zero Prop-Drilling:** Complete frontend state centralization using Zustand.
* **Heads-Up Notifications:** Asynchronous network alerts and UI confirmations are handled gracefully via `react-hot-toast`.

---

## 🛠️ Technology Stack

| Architecture | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 18, Vite |
| **Styling & UI** | Tailwind CSS v4, Shadcn UI (Radix), Lucide Icons |
| **State & Data** | Zustand, Axios, Recharts (Data Visualization) |
| **Backend API** | PHP 8+ (RESTful JSON API) |
| **Database** | MySQL (Relational Schema) |
| **Security** | `firebase/php-jwt`, bcrypt hashing |

---

## 📂 Project Structure

```text
fitness-tracker/
├── backend/                  # PHP API & Authentication
│   ├── .env                  # Environment variables (JWT Secret)
│   ├── auth_middleware.php   # JWT validation logic
│   ├── db.php                # PDO Database connection & CORS
│   └── endpoints/            # CRUD operations & algorithms
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # UI Components (Shadcn, Heatmap, Forms)
│   │   ├── store/            # Zustand global state (useWorkoutStore.js)
│   │   ├── services/         # Axios interceptors & API logic
│   │   └── App.jsx           # Routing & Layout
│   ├── package.json
│   └── tailwind.config.js    # Cyber-Athletic theme configuration
└── database/                 # SQL Migrations
    └── schema_v3.sql         # Full database schema and catalog seeds
```

---

## 🚀 Installation & Local Environment

### Prerequisites
* Node.js (v18+)
* PHP (v8.1+) & Composer
* MySQL Server (Laragon, XAMPP, or equivalent)

### 1. Database Initialization
1. Create a fresh MySQL database named `fitness_tracker`.
2. Import the provided schema (`database/schema_v3.sql`) to generate the required tables: `users`, `workouts`, `exercises_catalog`, `routines`, and `routine_exercises`. This will also seed the exercise catalog.

### 2. Backend (PHP) Configuration
1. Navigate to the `/backend` directory.
2. Install the necessary PHP dependencies via Composer:
   ```bash
   composer require firebase/php-jwt vlucas/phpdotenv
   ```
3. Create a `.env` file at the root of the `/backend` directory and define your secure JWT key:
   ```env
   JWT_SECRET_KEY="YOUR_SUPER_SECRET_KEY_HERE"
   ```
4. Serve the PHP environment locally (e.g., via Laragon, XAMPP, or PHP's built-in server):
   ```bash
   php -S localhost:8000
   ```

### 3. Frontend (React) Configuration
1. Navigate to the `/frontend` directory.
2. Install the required NPM packages:
   ```bash
   npm install
   ```
3. Ensure your API endpoint in `src/services/api.js` points to your local PHP server port.
4. Boot the Vite development server:
   ```bash
   npm run dev
   ```

---

**Developed & Architected via Antigravity / Gemini.** *Stay focused. Lift heavy.* 🦾