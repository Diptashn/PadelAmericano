# 🎾 Padel Americano & Social Tournament Manager

A high-performance, offline-first mobile and web application built with **React Native**, **Expo SDK 58**, **TypeScript**, and **Zustand** designed for social padel and pickleball players to manage round-robin Americano tournaments, score matches in real-time with complementary steppers, and share live leaderboards directly to WhatsApp.

---

## ⚡ Tech Stack & Architecture

- **Framework:** React Native + Expo (SDK 58)
- **Language:** TypeScript (Strict mode, fully typed)
- **Styling:** Custom Athletic Dark Design System (`#090D14` deep slate graphite, `#CCFF00` electric neon lime, `#00F0FF` cyan accents, `#F59E0B` podium gold)
- **State Management:** Zustand with Local Persistence (`persist` middleware)
- **Offline Storage:** `@react-native-async-storage/async-storage` (100% offline-ready, auto-syncing)
- **Haptic Engine:** Cross-platform tactile feedback (`expo-haptics` with Web `navigator.vibrate` fallback)
- **Viral Sharing:** React Native `Share` API + `expo-clipboard` + direct WhatsApp link (`whatsapp://` & `https://api.whatsapp.com/send`)

---

## 🎾 Core Rules & Match Engine

### 1. The Americano Format
- **4 Players:** 1 Court, 3 Rounds. Every player partners with every other player exactly once.
- **8 Players:** 2 Courts, 7 Rounds. Mathematically verified Whist tournament matrix:
  - Every player partners with every other player **exactly once** (28 unique pairs).
  - Every player plays against each opponent **exactly twice**.
- **5 Players:** 1 Court, 5 Rounds. 1 Bye per round (each player sits out 1 round and plays 4 matches). Every pair partners exactly once.
- **Dynamic Generator:** Greedy combinatorial partner/opponent distribution algorithm for custom player counts (6, 7, 10, 12, etc.).

### 2. Complementary Scoring Engine
- **Configurable Match Targets:** 16, 24, or **32 Points** (Default).
- **Complementary Stepper Controls:** Large touch targets (`+` / `-`) engineered for fast, sweaty on-court scorekeeping.
  - Tapping `+` on Team 1 automatically reduces Team 2 so `Team 1 + Team 2 === TotalPoints` (e.g. `18 - 14 = 32`).
- **Quick Presets:** Instant Draw (`16 - 16` or `12 - 12`), `+4 / -4` delta shifts.
- Every player earns the points their team scored in that round.

### 3. Standings & Ranking Criteria
1. **Total Cumulative Points Won** (Primary)
2. **Point Differential** (`Points Won - Points Conceded`) (Secondary)
3. **Matches Won** (Tertiary)

---

## 📱 Screens & Features

### 1. Setup & Player Roster (`/setup`)
- Quick Add Player with keyboard enter/submit support.
- **Quick Fill Demo Players:** Instant 1-tap fill with top Padel stars (*Galan, Lebron, Tapia, Coello, Paquito, Chingotto, Di Nenno, Stupaczuk*).
- **Saved Friends / Favorites List:** Auto-remembers past players and frequency so you don't have to retype names.
- Format selectors: 4 Players, 8 Players, 5 Players (Bye).
- Configurable match targets: `16 | 24 | 32 PTS`.
- Courts available: `1 Court | 2 Courts`.
- **"Generate Tournament"** button with validation.

### 2. Live Match & Scorekeeper (`/match`)
- Top Bar: Round progress header (`Round 3 of 7`) + interactive round pills to jump between rounds.
- Standings modal shortcut so players can check the live leaderboard anytime.
- **Court Cards:**
  - Court 1: Team 1 (`P1 & P2`) vs Team 2 (`P3 & P4`)
  - Court 2 (8 players): Team 3 (`P5 & P6`) vs Team 4 (`P7 & P8`)
  - Bye Card (5 players): `Player sits out this round ☕`
- Large touch steppers with haptic feedback.
- **"Save & Next Round"** advances round; finishes tournament on final round.

### 3. Live Standings & Tournament Summary (`/standings`)
- High-contrast, 3D podium-styled leaderboard:
  - 🥇 **1st Place:** Gold crown badge, player name, points won, differential.
  - 🥈 **2nd Place:** Silver badge & stats.
  - 🥉 **3rd Place:** Bronze badge & stats.
  - **4th - 8th Place:** Rank, W-D-L record, points, diff.
- **Detailed Player Breakdown Modal:** Tap any player to see their individual match history across all rounds (partner, opponents, score, outcome, diff).

### 4. Viral WhatsApp Exporter (`Share Button`)
Generates the clean formatted text summary:
```text
🎾 Padel Americano - Final Standings
📅 Oct 17, 2026 | 📍 8 Players, 7 Rounds

🏆 PODIUM:
🥇 1. Agustin Tapia - 128 pts (+18)
🥈 2. Arturo Coello - 124 pts (+14)
🥉 3. Ale Galan - 120 pts (+10)

📋 COMPLETE RANKINGS:
4. Juan Lebron - 116 pts (+4)
5. Paquito Navarro - 112 pts (-2)
6. Fede Chingotto - 108 pts (-6)
7. Franco Stupaczuk - 102 pts (-14)
8. Martin Di Nenno - 98 pts (-24)

⚡ Generated with Padel Americano
```
- Actions: Direct WhatsApp send (`whatsapp://`), Native Share sheet, and 1-tap Clipboard Copy.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Start Local Development Server
```bash
# Navigate to the project
cd PadelAmericano

# Start Expo development server
npm start

# Or run directly on Web
npm run web

# Or run on Android / iOS
npm run android
npm run ios
```
Open [http://localhost:8081](http://localhost:8081) in any browser to preview the app.

---

## 📂 Project Directory Structure

```
PadelAmericano/
├── App.tsx                     # Main App with Tab Navigation & Safe Area
├── app.json                    # Expo project configuration
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── src/
    ├── types/
    │   └── index.ts            # Core TypeScript interfaces & types
    ├── constants/
    │   ├── theme.ts            # Dark athletic palette, fonts, shadows
    │   └── schedules.ts        # 4, 5, 8 Americano schedules & general generator
    ├── utils/
    │   ├── haptics.ts          # Cross-platform tactile haptic engine
    │   ├── tournamentEngine.ts # Tournament builder & ranking calculation
    │   └── shareFormatter.ts   # Viral WhatsApp text exporter & clipboard
    ├── store/
    │   └── tournamentStore.ts  # Zustand store with AsyncStorage persistence
    ├── components/
    │   ├── ScoreStepper.tsx    # Large touch steppers with haptics
    │   ├── CourtCard.tsx       # Dual-team card with complementary scoring
    │   ├── RoundProgressBar.tsx# Interactive round pills & navigation
    │   ├── StandingsTable.tsx  # Podium & full leaderboard with W/D/L
    │   ├── PlayerBreakdownModal.tsx # Match-by-match player history modal
    │   ├── WhatsAppShareModal.tsx   # WhatsApp preview & 1-tap export
    │   ├── FavoritesModal.tsx       # Saved friends roster selector
    │   └── TournamentHistoryModal.tsx # Past tournament history
    └── screens/
        ├── SetupScreen.tsx     # Setup, player count, quick fill, config
        ├── MatchScreen.tsx     # Live scorekeeper & round progress
        └── StandingsScreen.tsx # Podium, live rankings, WhatsApp export
```
