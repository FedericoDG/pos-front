import { z } from 'zod';

export const schema = z.object({
  code: z
    .string({ required_error: 'El Código es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  description: z
    .string({ required_error: ' Nombre es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' })
    .optional(),
});
