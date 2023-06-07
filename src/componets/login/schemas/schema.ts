import { z } from 'zod';

export const schema = z.object({
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'Debe contener al menos 6 caracteres'),
});
