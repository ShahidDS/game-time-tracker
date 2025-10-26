import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  userStatsResponseSchema,
  gameStatsResponseSchema,
  gameDataForAllSchema,
} from "../validators/statisticsSchema.ts";
import { startOfDay, subDays, subMonths, formatISO } from "date-fns";

const prisma = new PrismaClient();

export const userStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  //const { gameId } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Group play sessions by game and sum up the minutes played
    const gameAggregations = await prisma.playSession.groupBy({
      by: ["gameId"],
      where: { userId: Number(id) },
      _sum: { minutesPlayed: true },
      //_count: { _all: true },
      //_avg: { minutesPlayed: true },
    });

    // Fetch game details for those game IDs
    const gameIds = gameAggregations.map((g) => g.gameId);
    const games = await prisma.game.findMany({
      where: { id: { in: gameIds } },
      select: { id: true, name: true },
    });

    // Aggregated stats with game names
    const gameStats = gameAggregations.map((g) => {
      const game = games.find((gm) => gm.id === g.gameId);
      return {
        gameId: g.gameId,
        gameName: game?.name ?? "Unknown Game",
        minutesPlayed: g._sum.minutesPlayed ?? 0,
      };
    });

    // Total minutes played
    const totalMinutesPlayed = gameStats.reduce(
      (sum, g) => sum + g.minutesPlayed,
      0
    );

    // Percentage of total for each game
    const gameStatsWithPercentages = gameStats.map((g) => ({
      ...g,
      percentageOfTotal:
        totalMinutesPlayed > 0
          ? parseFloat(
              ((g.minutesPlayed / totalMinutesPlayed) * 100).toFixed(2)
            )
          : 0,
    }));

    // Construct response
    const response = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage ?? "",
      },
      totalMinutesPlayed,
      gameStats: gameStatsWithPercentages,
    };

    // Validate response with Zod schema
    const validatedResponse = userStatsResponseSchema.parse(response);

    res.json(validatedResponse);
    //res.json(response);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

export const gameBasedStats = async (req: Request, res: Response) => {
  const { id, gameId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, firstName: true, lastName: true, profileImage: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compute date 7 days ago
    //const oneMonthAgo = subMonths(new Date(), 1);
    //console.log(oneMonthAgo);
    //const sevenDaysAgo = subDays(new Date(), 7);
    const sevenDaysAgo = subMonths(new Date(), 1);
    //console.log(sevenDaysAgo);

    // All sessions within the last 7 days for the game
    const sessions = await prisma.playSession.findMany({
      where: {
        userId: Number(id),
        gameId: Number(gameId),
        updatedAt: { gte: sevenDaysAgo },
      },
      select: { minutesPlayed: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: "asc" },
    });

    const totalMinutesPerWeek = sessions.reduce(
      (sum, s) => sum + (Number(s.minutesPlayed) || 0),
      0
    );

    // minutes played per day
    const minutesPerDayMap = sessions.reduce<Record<string, number>>(
      (acc, session) => {
        const day = session.updatedAt.toISOString().split("T")[0] ?? "";
        acc[day] = (acc[day] || 0) + session.minutesPlayed;
        return acc;
      },
      {}
    );

    const minutesPlayedPerDayInAWeek = Object.entries(minutesPerDayMap)
      .map(([date, minutes]) => ({ date, minutes }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const gameName = await prisma.game.findUnique({
      where: { id: Number(gameId) },
      select: { id: true, name: true },
    });

    const response = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage ?? "",
      },
      game: gameName ?? { id: Number(gameId), name: "Unknown Game" },

      weeklyStats: {
        numOfSessionsPerWeek: sessions.length ?? 0,
        averageSessionLengthPerWeek:
          sessions.length > 0
            ? Number((totalMinutesPerWeek / sessions.length).toFixed(2))
            : 0,
        totalMinutesPerWeek: totalMinutesPerWeek,
        minutesPlayedPerDayInAWeek: minutesPlayedPerDayInAWeek,
      },
    };

    const validatedResponse = gameStatsResponseSchema.parse(response);

    res.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching user game weekly stats:", error);
    res.status(500).json({ error: "Failed to fetch weekly stats" });
  }
};

export const gameStatsAllUser = async (req: Request, res: Response) => {
  const { gameId } = req.params;

  try {
    const now = new Date();
    //const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = subMonths(new Date(), 1);
    const sessions = await prisma.playSession.findMany({
      where: {
        gameId: Number(gameId),
        updatedAt: {
          gte: sevenDaysAgo,
          lte: now,
        },
      },
      select: { gameId: true, minutesPlayed: true },
    });

    const totalMinutesPlayed = sessions.reduce(
      (sum, s) => sum + s.minutesPlayed,
      0
    );

    const game = await prisma.game.findUnique({
      where: { id: Number(gameId) },
      select: { id: true, name: true },
    });

    const response = {
      game: {
        id: Number(gameId),
        name: game?.name ?? "Unknown Game",
        totalMinutesPlayedbyAll: totalMinutesPlayed ?? 0,
      },
    };

    const validatedResponse = gameDataForAllSchema.parse(response);

    res.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).json({ error: "Failed to fetch game data" });
  }
};

export const gameTopPlayerStats = async (req: Request, res: Response) => {
  const { gameId } = req.params;

  try {
    // Group play sessions by user and sum up the minutes played
    const userAggregations = await prisma.playSession.groupBy({
      by: ["userId"],
      where: { gameId: Number(gameId) },
      _sum: { minutesPlayed: true },
    });

    if (userAggregations.length === 0) {
      return res
        .status(404)
        .json({ message: "No play sessions found for this game" });
    }

    // Find the top player (user with the most minutes)
    const topPlayer = userAggregations.reduce((max, curr) =>
      (curr._sum.minutesPlayed ?? 0) > (max._sum.minutesPlayed ?? 0)
        ? curr
        : max
    );

    // Fetch user info
    const user = await prisma.user.findUnique({
      where: { id: topPlayer.userId },
      select: { id: true, firstName: true, lastName: true },
    });

    // Fetch game info (optional but often useful)
    const game = await prisma.game.findUnique({
      where: { id: Number(gameId) },
      select: { id: true, name: true },
    });

    const response = {
      gameId: game?.id,
      gameName: game?.name,
      topPlayerId: user?.id,
      topPlayerName: user
        ? `${user.firstName} ${user.lastName}`.trim()
        : "Unknown Player",
      totalMinutesPlayed: topPlayer._sum.minutesPlayed ?? 0,
    };

    //const validatedResponse = gameDataForAllSchema.parse(response);

    res.json(response);
  } catch (error) {
    console.error("Error fetching top Player:", error);
    res.status(500).json({ error: "Failed to fetch top player" });
  }
};
