import { z } from 'zod';

export const schema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  barcode: z.string().nonempty(),
  description: z.string().optional(),
  unitId: z.preprocess((val) => Number(val), z.number()),
  categoryId: z.preprocess((val) => Number(val), z.number()),
  lowstock: z.preprocess((val) => Number(val), z.number()),
});
