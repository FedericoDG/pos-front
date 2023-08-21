import { z } from 'zod';

export const schema = z.object({
  description: z.string().optional(),
  discount: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: 'Sólo se aceptan números' })
  ),
  recharge: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: 'Sólo se aceptan números' })
  ),
  invoceType: z.object({}, { required_error: 'El Tipo de Comprobante es requerido' }),
});
