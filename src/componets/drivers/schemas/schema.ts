import { z } from 'zod';

export const schema = z
  .object({
    code: z
      .string({ required_error: 'El Código es requerido' })
      .trim()
      .nonempty({ message: 'Debe contener al menos un caracter' }),
    user: z.object({
      lastname: z
        .string({ required_error: 'El Apellido es requerido' })
        .trim()
        .nonempty({ message: 'Debe contener al menos un caracter' }),
      name: z
        .string({ required_error: 'El Nombre es requerido' })
        .trim()
        .nonempty({ message: 'Debe contener al menos un caracter' }),
      email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
    }),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .trim()
      .min(6, 'Debe tener al menos 6 caracteres'),
    password2: z
      .string({ required_error: 'La contraseña es requerida' })
      .trim()
      .min(6, 'Debe tener al menos 6 caracteres'),
    description: z.string().optional(),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Las contraseñas no coinciden',
    path: ['password2'],
  });
