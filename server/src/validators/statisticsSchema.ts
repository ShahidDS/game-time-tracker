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
});

export const gameStatsResponseSchema = z.object({
  user: userProfileSchema,
  //totalMinutesPerWeek: z.number(),
  weeklyStats: weeklyStatsSchema,
});
