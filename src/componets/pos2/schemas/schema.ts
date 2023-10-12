import { z } from 'zod';

export const schema = z.object({
  discount: z
    .preprocess(
      (val) => Number(val),
      z.number().nonnegative('EL descuento del impuesto debe ser mayor a 0')
    )
    .optional(),
  recharge: z
    .preprocess(
      (val) => Number(val),
      z.number().nonnegative('El descuento del impuesto debe ser mayor a 0')
    )
    .optional(),
  info: z.string().optional(),
  payments: z
    .object(
      {
        amount: z.preprocess(
          (val) => Number(val),
          z.number().min(1, 'El importe del pago debe ser mayor a 0')
        ),
        paymentMethodId: z.preprocess((val) => Number(val), z.number()),
      },
      { required_error: 'Agregue al menos un medio de pago y su importe' }
    )
    .array()
    .min(1, 'Agregue al menos un medio de pago y su importe'),
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
