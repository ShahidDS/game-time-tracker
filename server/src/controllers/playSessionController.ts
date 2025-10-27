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
      },
      select: {
        id: true,
        userId: true,
        gameId: true,
        minutesPlayed: true,
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
      select: {
        minutesPlayed: true,
        id: true,
        gameId: true,
        game: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { id: 'desc' },
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
export const getPlaySessionByUserId = async (req: Request, res: Response) => {
  const userIdParam = req.params.userId;
  const userId = parseInt(userIdParam ?? '', 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const sessions = await prisma.playSession.findMany({
      where: { userId },
      select: {
        minutesPlayed: true,
        id: true,
        gameId: true,
        game: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { id: 'desc' },
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
  const sessionId = parseInt(req.params.id ?? '', 10);

  if (Number.isNaN(sessionId)) {
    return res.status(400).json({ error: 'Invalid session id' });
  }

  try {
    const session = await prisma.playSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Play session not found' });
    }

    // Delete the session
    await prisma.playSession.delete({
      where: { id: sessionId },
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
