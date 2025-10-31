# 🎮 Game Time Tracker

A full-stack application that allows users to play games, track their progress and compare statistics with other players.

## 🚀 Features

- **User Management**
  - View user profiles with avatar, name, and total playtime.
  
- **Game Sessions**
  - Start and stop a game session with automatic timer.
  - Record playtime accurately (minutes and seconds).
  - Update user, game, and daily stats totals automatically.
  
- **Dashboard & Charts**
  - Line chart displaying users’ daily play.
  - Horizontal bar chart displaying total minutes played per game.
  - Doughnut chart displaying percentages of total play time per game.
  - Scatter chart displaying users’ weekly play.
  - Real-time chart updates when sessions are added or deleted.
  - Summary of total minutes played.

- **Session Management**
  - Delete individual play sessions.
  - Backend automatically adjusts totals when a session is deleted.

- **Responsive UI**
  - Works on desktop and mobile devices.

- **Track Play Time**: Use a timer to track time for different games.
  The timer counts the time as seconds and only when 60 seconds pass we count that time as 1 minute and it get stored in
   "minutesPlayed" in the "PlaySession" table.
  
- **Player Statistics**: Diiferent graph and chart shows play statistics based on daily and weekly data.
  
- **Leaderboard**: Compare stattistics with other players, showing the top users per game.
  
--- 

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, react-router-dom, react-chartjs-2  
- **Backend:** Node.js, Express, TypeScript, Prisma ORM  
- **Database:** PostgreSQL  
- **API Validation:** Zod  
- **Routing:** React Router  
- **HTTP Requests:** Axios

---

### 🔗 Navbar
<img width="1286" height="167" alt="NavBar" src="https://github.com/user-attachments/assets/57912160-6ed4-49d9-9bc9-aaad98caedd7" />

### 🧿 Sign Up Page
<img width="1448" height="740" alt="Singup" src="https://github.com/user-attachments/assets/766054ba-dcee-4de7-8334-16a1b4dc89cd" />

### 👩🏻‍🎤 Users Page

<img width="1444" height="900" alt="Users" src="https://github.com/user-attachments/assets/26f6ba03-70c4-4056-a80c-6e25e365ad09" />

### 🎮 Games Page
<img width="1443" height="961" alt="Games" src="https://github.com/user-attachments/assets/bca74b5c-ee94-4173-b08a-3c637cd993e3" />

### 🔥 Game Timer Page
<img width="1438" height="961" alt="Game-sessions" src="https://github.com/user-attachments/assets/08f3ca2c-e729-479b-8ca3-da393542fc3e" />

### 📊 Games Statistics

<img width="1442" height="809" alt="Games-stats" src="https://github.com/user-attachments/assets/6377668b-d482-4de4-85ef-f2b8c199879a" />

<img width="1188" height="955" alt="Weekly-Daily" src="https://github.com/user-attachments/assets/0b1a6b8c-9480-42c2-b762-193e4fcd6783" />

---

## 🗃️ ER Diagram
The database of four tables:
User, Game, PlaySession, and UserStats.

![Games-Tracker](https://github.com/user-attachments/assets/9be4e0ae-e23a-4065-a3e9-2d203263034d)


<pre>
User -> PlaySession: One-to-many One user can have many play sessions.

Game -> PlaySession: One-to-many One game can appear in many sessions.

User -> Game: Many-to-many through PlaySession 

User -> UserStats: One-to-many (cascade delete) One user can have many daily stats (deleted automatically if the user is removed).
</pre>

## 🧩 Database Schema (Prisma)

```prisma
model User {
  id                 Int           @id @default(autoincrement())
  firstName          String
  lastName           String
  email              String        @unique
  profileImage       String?
  totalMinutesPlayed Int           @default(0)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
  sessions           PlaySession[]
  stats              UserStats[]
}

model Game {
  id                 Int           @id @default(autoincrement())
  name               String
  totalMinutesPlayed Int           @default(0)
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
  sessions           PlaySession[]
}

model PlaySession {
  id            Int      @id @default(autoincrement())
  userId        Int
  gameId        Int
  minutesPlayed Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  statedAt      DateTime?
  endedAt       DateTime?
  game          Game     @relation(fields: [gameId], references: [id])
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserStats {
  id            Int      @id @default(autoincrement())
  userId        Int
  date          DateTime
  minutesPlayed Int      @default(0)
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
}

...


## 🛠 How to Run:

1. Clone the repository:
   ```bash
   git clone https://github.com/ShahidDS/game-time-tracker.git
   cd game-time-tracker
   ```

2. Install dependencies for both client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
3. Set up Enviromental Variables:
  -Create a `.env` file in the `server` directory.
  - Add the following variable in `.env` to configure the database connection:
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

4. Set up the database and apply Prisma migrations:
     ```bash
     cd server
     npm install prisma @prisma/client@latest @prisma/extension-accelerate@latest
     npx prisma generate --no-engine
     npx prisma migrate dev


5. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

6. Start the development servers:
   - **Client**:
     ```bash
     cd client
     npm run dev
     ```
   - **Server**:
     ```bash
     cd server
     npm run dev
     ```

---

## 🎮 Usage

1. Open the client in your browser (default: `http://localhost:5173`).
2. Start tracking your playtime by playing games and view statistics.

---
