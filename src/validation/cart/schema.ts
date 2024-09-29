import { z } from 'zod';

const addCartRequestSchema = z.object({
  food_id: z.number().int(),
});

const updateCartRequestSchema = addCartRequestSchema.extend({
  quantity: z.number().int(),
});

type AddCartRequest = z.infer<typeof addCartRequestSchema>;
type UpdateCartRequest = z.infer<typeof updateCartRequestSchema>;

export {
  addCartRequestSchema,
  updateCartRequestSchema,
  type AddCartRequest,
  type UpdateCartRequest,
};
