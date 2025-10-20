import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  totalMinutesPlayed: z.number().min(0).optional(),
});

export const userUpdateSchema = userSchema.partial();
