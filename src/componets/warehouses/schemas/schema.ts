import { z } from 'zod';

export const schema = z.object({
  code: z
    .string({ required_error: 'El Código es requerido' })
    .trim()
    .nonempty({ message: 'Debe contener al menos un caracter' }),
  address: z.string().optional(),
  description: z.string().optional(),
});
