import { z } from 'zod';
import { stringIntegerSchema } from '../schema';

const foodRequestSchema = z.object({
  foodName: z.string().optional(),
  menuId: stringIntegerSchema.optional(),
  storeId: stringIntegerSchema.optional(),
  page: stringIntegerSchema.optional(),
  pageSize: stringIntegerSchema.optional(),
});

const todayFoodSchema = z.object({
  food_id: z.number(),
  name: z.string(),
  image: z.string().nullable().optional(),
  store_name: z.string(),
  store_address: z.string(),
  store_id: z.number(),
});

const foodSchema = todayFoodSchema
  .omit({ store_name: true, store_address: true })
  .extend({
    price: z.number(),
    description: z.string().nullable().optional(),
    store_id: z.number(),
    tags: z.string().array(),
  });

const checkStockRequestSchema = z.object({
  food_id: z.number().int(),
  quantity: z.number().int(),
});
const checkStockResponseSchema = checkStockRequestSchema.extend({
  stock: z.number().int(),
});

type FoodRequest = z.infer<typeof foodRequestSchema>;
type TodayFood = z.infer<typeof todayFoodSchema>;
type Food = z.infer<typeof foodSchema>;
type CheckStockRequest = z.infer<typeof checkStockRequestSchema>;
type CheckStockResponse = z.infer<typeof checkStockResponseSchema>;

export {
  todayFoodSchema,
  foodRequestSchema,
  checkStockRequestSchema,
  type FoodRequest,
  type TodayFood,
  type Food,
  type CheckStockRequest,
  type CheckStockResponse,
};
