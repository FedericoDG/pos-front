import { z } from 'zod';

export const schemaDischarge = z.object({
  warehouseId: z.preprocess((val) => Number(val), z.number()),
  reasonId: z.preprocess((val) => Number(val), z.number()),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int('Debe ser un número entero').min(1, 'La cantidad debe ser mayor a 0')
  ),
  cost: z.preprocess((val) => Number(val), z.number().min(1, 'El costo debe ser mayor a 0')),
  info: z.string().optional(),
});
