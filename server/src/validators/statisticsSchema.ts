import { z } from "zod";

export const userProfileSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  profileImage: z.string().url(),
});

export const gameStatsItemSchema = z.object({
  gameId: z.number(),
  gameName: z.string(),
  minutesPlayed: z.number(),
  percentageOfTotal: z.number(),
  //numOfSessionsPerWeek: z.number(),
  //averageSessionLengthPerWeek: z.number(),
});

export const userStatsResponseSchema = z.object({
  user: userProfileSchema,
  totalMinutesPlayed: z.number(),
  gameStats: z.array(gameStatsItemSchema),
});

export const weeklyStatsSchema = z.object({
  numOfSessionsPerWeek: z.number(),
  averageSessionLengthPerWeek: z.number(),
  totalMinutesPerWeek: z.number(),
  minutesPlayedPerDayInAWeek: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
      minutes: z.number().nonnegative(),
    })
  ),
});

export const gameSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export const gameStatsResponseSchema = z.object({
  user: userProfileSchema,
  game: gameSchema,
  weeklyStats: weeklyStatsSchema,
});

export const gameDataForAllSchema = z.object({
  game: z.object({
    id: z.number(),
    name: z.string(),
    totalMinutesPlayedbyAll: z.number(),
  }),
});
