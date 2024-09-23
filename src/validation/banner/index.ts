import { z } from 'zod';

const bannerSchema = z.object({
  banner_id: z.number(),
  name: z.string(),
  image: z.string(),
});

type Banner = z.infer<typeof bannerSchema>;

export { bannerSchema, type Banner };
