import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log("🚀 Connecting to PostgreSQL via Prisma...");

    // 🧹 Clear existing data
    await prisma.userStats.deleteMany();
    await prisma.playSession.deleteMany();
    await prisma.game.deleteMany();
    await prisma.user.deleteMany();
    console.log("🧹 Cleared all tables");

    // 👥 Create users
    const usersData = [
      {
        firstName: "Kunnikar",
        lastName: "Boonbunlu",
        email: "kunnikar@gmail.com",
      },
      {
        firstName: "Israt",
        lastName: "Erin",
        email: "israt@gmail.com",
      },
      {
        firstName: "Shahid",
        lastName: "Manzoor",
        email: "shahid@gmail.com",
      },
      {
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie@gmail.com",
      },
      {
        firstName: "David",
        lastName: "Williams",
        email: "david@gmail.com",
      },
      {
        firstName: "Eve",
        lastName: "Davis",
        email: "eve@gmail.com",
      },
      {
        firstName: "Frank",
        lastName: "Miller",
        email: "frank@gmail.com",
      },
      {
        firstName: "Grace",
        lastName: "Wilson",
        email: "grace@gmail.com",
      },
      {
        firstName: "Hannah",
        lastName: "Moore",
        email: "hannah@gmail.com",
      },
    ];

    const users = await Promise.all(
      usersData.map((u) =>
        prisma.user.create({
          data: {
            ...u,
            profileImage: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
              u.email
            )}`,
            totalMinutesPlayed: 0,
          },
        })
      )
    );

    // 🕹️ Create games
    const gamesData = [
      { name: "Chess" },
      { name: "Sudoku" },
      { name: "Tetris" },
      { name: "Tic-Tac-Toe" },
    ];
    const games = await Promise.all(
      gamesData.map((g) =>
        prisma.game.create({ data: { ...g, totalMinutesPlayed: 0 } })
      )
    );

    // 🎮 Create play sessions
    const sessions = [
      // Kunnikar
      {
        userEmail: "kunnikar@gmail.com",
        gameName: "Chess",
        minutesPlayed: 120,
        createdAt: new Date("2025-10-10T10:00:00Z"),
      },
      {
        userEmail: "kunnikar@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 140,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "kunnikar@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 60,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },

      // Israt
      {
        userEmail: "israt@gmail.com",
        gameName: "Chess",
        minutesPlayed: 90,
        createdAt: new Date("2025-10-10T10:00:00Z"),
      },
      {
        userEmail: "israt@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 245,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },

      // Shahid
      {
        userEmail: "shahid@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 350,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "shahid@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 80,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      {
        userEmail: "shahid@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 50,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },
      // Charlie
      {
        userEmail: "charlie@gmail.com",
        gameName: "Chess",
        minutesPlayed: 70,
        createdAt: new Date("2025-10-10T10:00:00Z"),
      },
      {
        userEmail: "charlie@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 60,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "charlie@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 90,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      {
        userEmail: "charlie@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 50,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },
      // David
      {
        userEmail: "david@gmail.com",
        gameName: "Chess",
        minutesPlayed: 110,
        createdAt: new Date("2025-10-10T10:00:00Z"),
      },
      {
        userEmail: "david@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 70,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      // Eve
      {
        userEmail: "eve@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 130,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "eve@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 70,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      {
        userEmail: "eve@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 50,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },
      // Frank
      {
        userEmail: "frank@gmail.com",
        gameName: "Chess",
        minutesPlayed: 100,
        createdAt: new Date("2025-10-10T10:00:00Z"),
      },
      {
        userEmail: "frank@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 80,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "frank@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 60,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      {
        userEmail: "frank@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 40,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },
      // Grace
      {
        userEmail: "grace@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 120,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "grace@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 80,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      {
        userEmail: "grace@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 60,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },
      // Hannah
      {
        userEmail: "hannah@gmail.com",
        gameName: "Sudoku",
        minutesPlayed: 90,
        createdAt: new Date("2025-10-11T10:00:00Z"),
      },
      {
        userEmail: "hannah@gmail.com",
        gameName: "Tetris",
        minutesPlayed: 70,
        createdAt: new Date("2025-10-12T10:00:00Z"),
      },
      {
        userEmail: "hannah@gmail.com",
        gameName: "Tic-Tac-Toe",
        minutesPlayed: 50,
        createdAt: new Date("2025-10-13T10:00:00Z"),
      },
    ];

    for (const s of sessions) {
      const user = await prisma.user.findUnique({
        where: { email: s.userEmail },
      });
      const game = await prisma.game.findFirst({ where: { name: s.gameName } });

      if (!user || !game) continue;

      // ➕ Create play session
      await prisma.playSession.create({
        data: {
          userId: user.id,
          gameId: game.id,
          minutesPlayed: s.minutesPlayed,
          createdAt: s.createdAt,
          updatedAt: s.createdAt,
        },
      });

      // 🔁 Update user total
      await prisma.user.update({
        where: { id: user.id },
        data: { totalMinutesPlayed: { increment: s.minutesPlayed } },
      });

      // 🔁 Update game total
      await prisma.game.update({
        where: { id: game.id },
        data: { totalMinutesPlayed: { increment: s.minutesPlayed } },
      });

      // 📊 Update or create UserStats for the day
      const dayOnly = new Date(s.createdAt);
      dayOnly.setUTCHours(0, 0, 0, 0);

      await prisma.userStats.upsert({
        where: { userId_date: { userId: user.id, date: dayOnly } },
        update: { minutesPlayed: { increment: s.minutesPlayed } },
        create: {
          userId: user.id,
          date: dayOnly,
          minutesPlayed: s.minutesPlayed,
        },
      });
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
