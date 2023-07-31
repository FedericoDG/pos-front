import { z } from 'zod';

export const schema2 = z.object({
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
  description: z.string().optional(),
});
