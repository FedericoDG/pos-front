import { z } from 'zod';

export const schema = z.object({
  description: z.string().optional(),
});
