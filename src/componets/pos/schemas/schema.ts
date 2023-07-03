import { z } from 'zod';

export const schema = z.object({
  paymentMethodId: z.preprocess((val) => Number(val), z.number()),
  discount: z.preprocess((val) => Number(val), z.number()).optional(),
  recharge: z.preprocess((val) => Number(val), z.number()).optional(),
  options: z.string().nonempty(),
});
