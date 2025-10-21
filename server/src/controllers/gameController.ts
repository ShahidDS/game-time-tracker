import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { gameSchema, gameUpdateSchema } from '../validators/gameSchema';

const prisma = new PrismaClient();

// Get all games
export const getGames = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// Get game by ID
export const getGameById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const game = await prisma.game.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game by id:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

// Create a new game
export const createGame = async (req: Request, res: Response) => {
  try {
    const validated = gameSchema.parse(req.body);
    const game = await prisma.game.create({
      data: {
        name: validated.name,
        totalMinutesPlayed: 0, // Start with 0 minutes
      },
    });
    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : error });
  }
};

// Update game by ID
export const updateGame = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const validated = gameUpdateSchema.parse(req.body);
    
    const game = await prisma.game.update({
      where: { id: Number(id) },
      data: validated,
    });
    res.json(game);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(400).json({ error });
  }
};

// Delete game by ID
export const deleteGame = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.game.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Game deleted successfully'});
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

// Get game statistics
export const getGameStats = async (req: Request, res: Response) => {
  try {
    const gameStats = await prisma.game.findMany({
      select: {
        id: true,
        name: true,
        totalMinutesPlayed: true,
        createdAt: true,
        _count: {
          select: {
            sessions: true,
          },
        },
        sessions: {
          select: {
            minutesPlayed: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Last 10 sessions
        },
      },
      orderBy: {
        totalMinutesPlayed: 'desc',
      },
    });

    // Calculate additional statistics
    const statsWithCalculations = gameStats.map(game => ({
      ...game,
      averageSessionLength: game._count.sessions > 0 
        ? Math.round(game.totalMinutesPlayed / game._count.sessions)
        : 0,
    }));

    res.json(statsWithCalculations);
  } catch (error) {
    console.error('Error fetching game statistics:', error);
    res.status(500).json({ error: 'Failed to fetch game statistics' });
  }
};

// Get detailed statistics for a specific game
export const getGameDetailedStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const game = await prisma.game.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        totalMinutesPlayed: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sessions: true,
          },
        },
        sessions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Calculate additional statistics
    const averageSessionLength = game._count.sessions > 0 
      ? Math.round(game.totalMinutesPlayed / game._count.sessions)
      : 0;

    // Get unique players
    const uniquePlayers = new Set(game.sessions.map(session => session.userId)).size;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = game.sessions.filter(session => 
      new Date(session.createdAt) > thirtyDaysAgo
    );

    const stats = {
      ...game,
      averageSessionLength,
      uniquePlayers,
      recentSessionsCount: recentSessions.length,
      recentMinutesPlayed: recentSessions.reduce((total, session) => total + session.minutesPlayed, 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching detailed game statistics:', error);
    res.status(500).json({ error: 'Failed to fetch detailed game statistics' });
  }
};