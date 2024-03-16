import { z } from 'zod';

export const schema = z.object({
  name: z
    .string({ required_error: 'El Nombre es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  code: z
    .string({ required_error: 'El Código es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  barcode: z
    .string({ required_error: 'El Código de Barra es requerido' })
    .regex(/^[0-9]+$/, 'Sólo se aceptan números')
    .min(12, 'Debe entre 12 y 13 dígitos')
    .max(13, 'Debe entre 12 y 13 dígitos')
    .optional(),
  description: z.string().optional(),
  unitId: z.preprocess((val) => Number(val), z.number()),
  categoryId: z.preprocess((val) => Number(val), z.number()),
  ivaConditionId: z.preprocess((val) => Number(val), z.number()),
  lowstock: z.preprocess((val) => Number(val), z.number()),
});
