import { z } from 'zod';

export const schema = z.object({
  price: z
    .string({ required_error: 'El Código de Barra es requerido' })
    .regex(/^[\.0-9]*$/, 'Sólo se aceptan números'),
  //.regex(/^[0-9]+$/, 'Sólo se aceptan números'),
  pricelistId: z.preprocess((val) => Number(val), z.number()),
});
