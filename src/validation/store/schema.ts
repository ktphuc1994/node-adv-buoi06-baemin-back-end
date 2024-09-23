import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

const storeSchema = z.object({
  store_id: z.number(),
  address: z.string(),
  name: z.string(),
  open_hour: z.date().nullable(),
  close_hour: z.date().nullable(),
  price_range: z.string().nullable(),
  rating: z.instanceof(Decimal).nullable(),
  total_rating: z.number().nullable(),
  partner_id: z.number().nullable(),
});

type Store = z.infer<typeof storeSchema>;

export { storeSchema, type Store };
