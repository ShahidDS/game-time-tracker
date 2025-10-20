import { z } from 'zod';

export const gameSchema = z.object({
  name: z.string().min(1, 'Game name is required'),
});

export const gameUpdateSchema = gameSchema.partial();
