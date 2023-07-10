import { z } from 'zod';

export const schema = z
  .object({
    name: z
      .string({ required_error: 'El Nombre es requerido' })
      .trim()
      .nonempty({ message: 'Debe contener al menos un caracter' }),
    lastname: z
      .string({ required_error: 'El Apellido es requerido' })
      .trim()
      .nonempty({ message: 'Debe contener al menos un caracter' }),
    email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
    password: z
      .string({ required_error: 'La contraseña es requerida' })
      .trim()
      .min(6, 'Debe tener al menos 6 caracteres'),
    password2: z
      .string({ required_error: 'La contraseña es requerida' })
      .trim()
      .min(6, 'Debe tener al menos 6 caracteres'),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Las contraseñas no coinciden',
    path: ['password2'],
  });
