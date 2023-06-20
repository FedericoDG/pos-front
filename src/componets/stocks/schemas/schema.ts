import { z } from 'zod';

export const schema = z.object({
  warehouseId: z.preprocess((val) => Number(val), z.number()),
  reasonId: z.preprocess((val) => Number(val), z.number()),
  quantity: z
    .string({ required_error: 'La Cantidad es requerida' })
    .regex(/^[1-9][0-9]*$/, 'Sólo se aceptan números mayores que 0'),
  info: z.string().optional(),
});
