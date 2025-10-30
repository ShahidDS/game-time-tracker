# 🎮 Game Time Tracker

A full-stack application that allows users to play games, track their progress and compare statistics with other players.

## 🚀 Features

- **Track Play Time**: Use a timer to track time for different games.
  The timer counts the time as seconds and only when 60 seconds pass we count that time as 1 minute and it get stored in
   "minutesPlayed" in the "PlaySession" table.
- **Player Statistics**: Diiferent graph and chart shows play statistics based on daily and weekly data
- **Leaderboard**: Compare stattistics with other players
  

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript + Node.js
- **Database**: PostgreSQL


## 🗃️ ER Diagram
The database of four tables:
User, Game, PlaySession, and UserStats.

![gamesTracker](https://github.com/user-attachments/assets/944819a3-5ba1-427e-8134-604618cc647f)

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
  game          Game     @relation(fields: [gameId], references: [id])
  user          User     @relation(fields: [userId], references: [id])
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
