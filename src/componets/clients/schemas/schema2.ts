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
  document: z
    .string({ required_error: 'El DNI es requerido' })
    .trim()
    .min(8, 'Debe tener 8 caracteres')
    .max(8, 'Debe tener 8 caracteres'),
  email: z.string({ required_error: 'El Email es requerido' }).email('No es un Email válido'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});
