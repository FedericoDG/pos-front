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
  email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
});
