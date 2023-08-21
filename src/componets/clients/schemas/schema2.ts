import { z } from 'zod';

export const schema2 = z.object({
  name: z
    .string({ required_error: 'El Nombre es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  lastname: z
    .string({ required_error: 'El Apellido es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  document: z
    .string({ required_error: 'El número es requerido' })
    .regex(/^[0-9]+$/, 'Sólo se aceptan números')
    .min(8, 'Debe tener 8 dígitos')
    .max(11, 'Debe tener 11 dígitos'),
  email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
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
