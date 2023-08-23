import { z } from 'zod';

export const schema = z.object({
  name: z.string({ required_error: 'El nombre de la categoría es obligatorio' }).nonempty(),
  description: z.string().optional(),
});
