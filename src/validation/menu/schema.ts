import { z } from 'zod';

const menuSchema = z.object({
  menu_id: z.number(),
  name: z.string(),
  image: z.string().nullable(),
});

type Menu = z.infer<typeof menuSchema>;

export { menuSchema, type Menu };
