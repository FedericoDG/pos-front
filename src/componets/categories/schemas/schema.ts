import { z } from 'zod';

export const schema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
});
