import { z } from 'zod';

export const schema = z.object({
  invoceType: z.object({}, { required_error: 'El Tipo de Comprobante es requerido' }),
  discount: z.preprocess((val) => Number(val), z.number()).optional(),
  recharge: z.preprocess((val) => Number(val), z.number()).optional(),
  info: z.string().optional(),
  payments: z
    .object({
      amount: z.preprocess(
        (val) => Number(val),
        z.number().min(1, 'El importe del pago debe ser mayor a 0')
      ),
      paymentMethodId: z.preprocess((val) => Number(val), z.number()),
    })
    .array(),
  otherTributes: z
    .object({
      amount: z.preprocess(
        (val) => Number(val),
        z.number().min(1, 'El importe del impuesto debe ser mayor a 0')
      ),
      otherTributeId: z.preprocess((val) => Number(val), z.number()),
    })
    .array()
    .optional(),
});
