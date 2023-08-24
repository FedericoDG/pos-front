import { z } from 'zod';

export const schemaCost = z.object({
  cost: z.preprocess((val) => Number(val), z.number().min(1, 'El costo debe ser mayor a 0')),
});
