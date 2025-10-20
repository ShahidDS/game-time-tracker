import { z } from 'zod';

export const playSessionSchema = z.object({
  userId: z.number().int().positive(),
  gameId: z.number().int().positive(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime(),
});
