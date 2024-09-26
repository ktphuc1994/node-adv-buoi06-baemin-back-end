import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

const storeSchema = z.object({
  store_id: z.number(),
  address: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  open_hour: z.date().nullable(),
  close_hour: z.date().nullable(),
  price_range: z.string().nullable(),
  rating: z.instanceof(Decimal).nullable(),
  total_rating: z.number().nullable(),
  partner_id: z.number().nullable(),
  shipping_partner: z
    .object({
      partner_name: z.string(),
      service_fee: z.instanceof(Decimal),
    })
    .optional(),
});

const storeAndMenu = storeSchema.extend({
  menuList: z
    .object({
      menu_id: z.number(),
      name: z.string(),
    })
    .array(),
});

type Store = z.infer<typeof storeSchema>;
type StoreAndMenu = z.infer<typeof storeAndMenu>;

export { storeSchema, type Store, type StoreAndMenu };
