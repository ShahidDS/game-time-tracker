import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { playSessionSchema } from '../validators/playSessionSchema.ts';

const prisma = new PrismaClient();

// Normalize date to UTC midnight
const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

//CREATE play session
export const createPlaySession = async (req: Request, res: Response) => {
  try {
    const validated = playSessionSchema.parse(req.body);
    const { userId, gameId, startedAt, endedAt } = validated;

    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const minutesPlayed = Math.max(
      Math.round((end.getTime() - start.getTime()) / 60000),
      0
    );

    // Create session
    const session = await prisma.playSession.create({
      data: {
        userId,
        gameId,
        minutesPlayed,
        createdAt: end,
      },
    });

    // Update user & game totals
    await prisma.user.update({
      where: { id: userId },
      data: { totalMinutesPlayed: { increment: minutesPlayed } } as any,
    });

    await prisma.game.update({
      where: { id: gameId },
      data: { totalMinutesPlayed: { increment: minutesPlayed } } as any,
    });

    // Update daily stats (UserStats)
    const day = normalizeDate(end);
    await prisma.userStats.upsert({
      where: {
        userId_date: { userId, date: day },
      },
      update: {
        minutesPlayed: { increment: minutesPlayed },
      },
      create: {
        userId,
        date: day,
        minutesPlayed,
      },
    });

    return res.status(201).json({
      message: 'Play session recorded successfully',
      session,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid input',
    });
  }
};

//GET all sessions
export const getAllPlaySessions = async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.playSession.findMany({
      include: { user: true, game: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Failed to fetch sessions',
    });
  }
};

//GET all play sessions user by userId
export const getUserStats = async (req: Request, res: Response) => {
  const userIdParam = req.params.userId;
  const userId = parseInt(userIdParam ?? '', 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const sessions = await prisma.playSession.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Failed to fetch user stats',
    });
  }
};

//DELETE play session by id
export const deletePlaySession = async (req: Request, res: Response) => {
  const sessionIdParam = req.params.id;
  const sessionId = parseInt(sessionIdParam ?? '', 10);

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: 'Invalid session id' });
  }

  try {
    // Find the session first
    const session = await prisma.playSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Play session not found' });
    }

    const { userId, gameId, minutesPlayed, createdAt } = session;

    // Delete the session
    await prisma.playSession.delete({
      where: { id: sessionId },
    });

    // Update user total
    await prisma.user.update({
      where: { id: userId },
      data: { totalMinutesPlayed: { decrement: minutesPlayed } },
    });

    // Update game total
    await prisma.game.update({
      where: { id: gameId },
      data: { totalMinutesPlayed: { decrement: minutesPlayed } },
    });

    // Update daily stats
    const day = normalizeDate(createdAt);
    await prisma.userStats.updateMany({
      where: { userId, date: day },
      data: { minutesPlayed: { decrement: minutesPlayed } },
    });

    return res.json({
      message: 'Play session deleted successfully',
      sessionId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete play session',
    });
  }
};
