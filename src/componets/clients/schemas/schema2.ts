import { z } from 'zod';

export const schema2 = z.object({
  name: z
    .string({ required_error: 'El Nombre es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  document: z
    .string({ required_error: 'El número es requerido' })
    .regex(/^[0-9]+$/, 'Sólo se aceptan números')
    .min(8, 'Mínimo 8 dígitos')
    .max(11, 'Máximo 11 dígitos'),
  phone: z
    .string()
    .regex(/^[0-9]+$/, 'Sólo se aceptan números')
    .optional(),
  mobile: z
    .string()
    .regex(/^[0-9]+$/, 'Sólo se aceptan números')
    .optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});
