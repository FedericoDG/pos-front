import { z } from 'zod';

export const schema = z
  .object({
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
