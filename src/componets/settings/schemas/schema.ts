import { z } from 'zod';

export const schema = z.object({
  name: z.string({ required_error: 'El nombre es obligatorio' }).trim(),
  address: z.string({ required_error: 'La dirección es obligatoria' }).trim(),
  cp: z.string({ required_error: 'El Código Postal es obligatorio' }).trim(),
  province: z.string({ required_error: 'La provincia es obligatoria' }).trim(),
  cuit: z.string({ required_error: 'El CUIT es obligatorio' }).trim(),
  invoceName: z.string({ required_error: 'El Nombre del Comprobante es obligatorio' }).trim(),
  invoceNumber: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: 'El n° de próx. comprobante es obligatorio',
        invalid_type_error: 'Sólo se aceptan números',
      })
      .min(1, 'El número debe ser mayor a 0')
  ),
});
