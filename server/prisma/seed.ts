import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log('🚀 Connecting to PostgreSQL via Prisma...');

    // 🧹 Clear existing data
    await prisma.userStats.deleteMany();
    await prisma.playSession.deleteMany();
    await prisma.game.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleared all tables');

    // 👥 Create users
    const usersData = [
      {
        firstName: 'Kunnikar',
        lastName: 'Boonbunlu',
        email: 'kunnikar@gmail.com',
      },
      { firstName: 'Israt', lastName: 'Erin', email: 'israt@gmail.com' },
      { firstName: 'Shahid', lastName: 'Manzoor', email: 'shahid@gmail.com' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@gmail.com' },
      { firstName: 'David', lastName: 'Williams', email: 'david@gmail.com' },
      { firstName: 'Eve', lastName: 'Davis', email: 'eve@gmail.com' },
      { firstName: 'Frank', lastName: 'Miller', email: 'frank@gmail.com' },
      { firstName: 'Grace', lastName: 'Wilson', email: 'grace@gmail.com' },
      { firstName: 'Hannah', lastName: 'Moore', email: 'hannah@gmail.com' },
    ];

    const users = await Promise.all(
      usersData.map((u) =>
        prisma.user.create({
          data: {
            ...u,
            profileImage: `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(u.email)}`,
            totalMinutesPlayed: 0,
          },
        })
      )
    );

    // 🕹️ Create games
    const gamesData = [
      { name: 'Chess' },
      { name: 'Sudoku' },
      { name: 'Tetris' },
      { name: 'Tic-Tac-Toe' },
    ];

    const games = await Promise.all(
      gamesData.map((g) =>
        prisma.game.create({ data: { ...g, totalMinutesPlayed: 0 } })
      )
    );

    // 📅 Generate daily play sessions (Oct 23–30)
    const startDate = new Date('2025-10-23T00:00:00Z');
    const endDate = new Date('2025-10-30T00:00:00Z');
    const dayMs = 24 * 60 * 60 * 1000;

    for (let d = startDate; d <= endDate; d = new Date(d.getTime() + dayMs)) {
      for (const user of users) {
        // Each user plays 2–3 games per day
        const gamesToday = [...games]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 2);

        let totalMinutesToday = 0;

        for (const game of gamesToday) {
          const minutesPlayed = Math.floor(Math.random() * 150) + 30; // 30–180 mins
          totalMinutesToday += minutesPlayed;

          const endedAt = new Date(d);
          endedAt.setUTCHours(10 + Math.floor(Math.random() * 8), 0, 0, 0); // 10AM–6PM range
          const startedAt = new Date(endedAt.getTime() - minutesPlayed * 60000);

          // 🎮 Create play session
          await prisma.playSession.create({
            data: {
              userId: user.id,
              gameId: game.id,
              minutesPlayed,
              startedAt,
              endedAt,
              createdAt: endedAt,
              updatedAt: endedAt,
            },
          });

          // 🔁 Update totals
          await prisma.user.update({
            where: { id: user.id },
            data: { totalMinutesPlayed: { increment: minutesPlayed } },
          });

          await prisma.game.update({
            where: { id: game.id },
            data: { totalMinutesPlayed: { increment: minutesPlayed } },
          });
        }

        // 📊 Update daily user stats
        const dayOnly = new Date(d);
        dayOnly.setUTCHours(0, 0, 0, 0);

        await prisma.userStats.upsert({
          where: { userId_date: { userId: user.id, date: dayOnly } },
          update: { minutesPlayed: { increment: totalMinutesToday } },
          create: {
            userId: user.id,
            date: dayOnly,
            minutesPlayed: totalMinutesToday,
          },
        });
      }
    }

    console.log(
      '✅ Seed completed successfully!'
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
