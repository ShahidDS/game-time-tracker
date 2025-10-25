# 🎮 Game Time Tracker

A full-stack application that allows users to track their gaming sessions and compare statistics with other players.

## 🚀 Features

- **Track Play Time**: Start and stop timers for different games
- **Player Statistics**: View your total play time per game
- **Global Leaderboard**: Compare your stats with other players
- **Session History**: See all your previous gaming sessions
- **Real-time Updates**: Live statistics and session tracking

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript + Node.js
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## 📁 Project Structure
# game-time-tracker

---

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
