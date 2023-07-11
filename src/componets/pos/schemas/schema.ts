import { z } from 'zod';

export const schema = z.object({
  discount: z.preprocess((val) => Number(val), z.number()).optional(),
  recharge: z.preprocess((val) => Number(val), z.number()).optional(),
  options: z.string().nonempty(),
  payments: z.array(
    z.object({
      amount: z.preprocess((val) => Number(val), z.number().min(1, 'El mínimo deber ser 1')),
      paymentMethodId: z.preprocess((val) => Number(val), z.number()),
    })
  ),
});
