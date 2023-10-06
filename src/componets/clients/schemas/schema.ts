import { z } from 'zod';

export const schema = z
  .object({
    name: z
      .string({ required_error: 'El Nombre es requerido' })
      .trim()
      .nonempty({ message: 'Debe contener al menos un caracter' }),
    document: z
      .string({ required_error: 'El número es requerido' })
      .regex(/^[0-9]+$/, 'Sólo se aceptan números')
      .min(8, 'Mínimo 8 dígitos')
      .max(11, 'Máximo 11 dígitos'),
    email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .trim()
      .min(6, 'Debe tener al menos 6 caracteres'),
    password2: z
      .string({ required_error: 'La contraseña es requerida' })
      .trim()
      .min(6, 'Debe tener al menos 6 caracteres'),
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
  })
  .refine((data) => data.password === data.password2, {
    message: 'Las contraseñas no coinciden',
    path: ['password2'],
  });
