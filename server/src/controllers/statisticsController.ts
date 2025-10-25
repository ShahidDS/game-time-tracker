import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { userStatsResponseSchema } from "../validators/statisticsSchema.ts";

const prisma = new PrismaClient();

export const userStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { gameId } = req.query;

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
      _count: { _all: true },
      _avg: { minutesPlayed: true },
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
        numOfSessionsPerWeek: g._count._all ?? 0,
        averageSessionLengthPerWeek: g._avg.minutesPlayed ?? 0,
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
