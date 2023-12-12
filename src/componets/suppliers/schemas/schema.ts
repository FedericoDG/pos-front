import { z } from 'zod';

export const schema = z.object({
  cuit: z
    .string({ required_error: 'El CUIT es requerido' })
    .regex(/^[0-9]+$/, 'Sólo se aceptan números')
    .min(11, 'Debe tener 11 dígitos')
    .max(11, 'Debe tener 11 dígitos'),
  name: z.string({ required_error: 'El Nombre es requerido' }).trim(),
  email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
  // .optional(),
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
