import { z } from 'zod';

export const schema = z.object({
  price: z.preprocess((val) => Number(val), z.number().min(1, 'El precio debe ser mayor a 0')),
  pricelistId: z.preprocess((val) => Number(val), z.number()),
});
