# 🦾 Fitness Tracker SaaS — V3 (The Ultimate Edition)

![Fitness Tracker Banner](https://via.placeholder.com/1200x400/000000/ccff00?text=FITNESS+TRACKER+V3+-+CYBER+ATHLETIC)

Welcome to **Fitness Tracker SaaS**, a radically aggressive, highly-focused, and highly-gamified workout tracking platform. 

Initially engineered as a CRUD prototype, it has been massively scaled into an enterprise-grade SaaS utilizing a **Cyber-Athletic** aesthetic (Neon Lime + Pitch Black), scientifically accurate **Bio-Metrics calculations**, and an engaged **Multiplayer Gamification** experience.

## ✨ Core Features (V3)

### 🏋️♂️ 1. Dynamic Hypertrophy & Cardio Engine
- **Intelligent Forms:** Automatically adapts input parameters depending on the targeted exercise (Cardio requests `Duration`, Strength requests `Sets`, `Reps`, and `Weight Lifted`).
- **Real-Time Volume & Caloric Maths:** The algorithm automatically parses scientific **MET (Metabolic Equivalent of Task)** coefficients against the user's BMI/Weight to accurately estimate caloric burn. Volume is computed on the fly.
- **Vast Catalog Database:** Pre-configured with over 25 precise biomechanical movements targeting specific muscle groups.

### 🧬 2. Cyber-Anatomy Heatmap
- **Visual Diagnostics:** Features a bespoke SVG Humanoid displaying a real-time heatmap of your muscular stress based on your past week's volume.
- Focus heavy on Chest day? The pectorals light up aggressively in `Neon Lime`.

### 🕹️ 3. Multiplayer Gamification & Leaderboards
- **Global Ladder:** Secure backend polling that pitches users against one another by calculating Total XP accumulated from workout density.
- **Ranks & Badges:** Automatically scales UI badging through tiers (Iron, Bronze, Silver, Gold).
- **Privacy First:** Automatic cryptographic email-masking on the leaderboard.

### ⚡ 4. One-Click Routines (Bulk Logging)
- Bypass tedious form filling with **Quick Templates** ("Push Day", "Pull Day"). Click once to deploy an entire 6-movement routine instantly into your log book using high-speed SQL bulk-inserts and Optimistic UI.

### 🔐 5. Enterprise Security & Architecture
- **Stateless JWT Auth:** Moving away from primitive local PHP sessions, the application leverages highly secure, time-based JSON Web Tokens through Axios Interceptor pipelines. Auto-boot on `401 Unauthorized`.
- **Zustand State Management:** Absolute 0 prop-drilling.
- **Heads-Up Notifications:** `react-hot-toast` displays smooth, immediate graphical network alerts across the UI.

---

## 🛠️ Technology Stack

| Domain | Technolgies |
| --- | --- |
| **Frontend** | React 18, Vite, Zustand, Tailwind CSS v4, Shadcn/UI, Recharts |
| **Backend** | PHP 8+, MySQL, `firebase/php-jwt` |
| **Design** | `bg-zinc-950`, Flat Borders, Cyberpunk aesthetics |

---

## 🚀 Installation & Local Environment

### Prerequisites
- Node.js (v18+)
- PHP (v8.1+) & Composer
- MySQL server (Laragon, XAMPP, or equivalent)

### 1. Database Setup
1. Create a MySQL database named `fitness_tracker`.
2. Import the schema/migrations to generate `users`, `workouts`, `exercises_catalog`, `routines`, and `routine_exercises`.
3. (Optional) Run `v3_migration.php` and `catalog_expansion.php` to seed the complex exercises and hypertrophy modules.

### 2. Backend (PHP) Configuration
1. Navigate to the `/backend` folder.
2. If `vendor/autoload.php` is missing, install the dependencies for JWT:
   ```bash
   composer require firebase/php-jwt vlucas/phpdotenv
   ```
3. Create a `.env` file at the root of `backend/` and set your secure secret:
   ```env
   JWT_SECRET_KEY="YOUR_SUPER_SECRET_KEY"
   ```
4. Serve the PHP environment locally via Laragon or PHP's built-in server:
   ```bash
   php -S localhost:8000
   ```

### 3. Frontend (React) Configuration
1. Navigate to the `/frontend` folder.
2. Install the necessary NPM dependencies:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
4. Target the backend endpoints inside `src/services/api.js` (assumed port `80` from Laragon or `8000` via CLI).

---

## 🖼️ User Interface 

*Insert screenshots of the Dashboard, Heatmap, and Leaderboard here before publishing to GitHub repository settings!*

---

**Developed & Architected entirely via Antigravity / Gemini.**  
*Stay focused. Lift heavy. 🦾*