import { z } from 'zod';
import { stringIntegerSchema } from '../schema';

enum PAYMENT_TYPE {
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  CARD = 'CARD',
  COD = 'COD',
}

enum ORDER_STATUS {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

const paymentTypeSchema = z.nativeEnum(PAYMENT_TYPE);
const orderStatusSchema = z.nativeEnum(ORDER_STATUS);

const getInformationByFoodIdsRequestSchema = z.object({
  foodIds: stringIntegerSchema.array(),
  storeId: stringIntegerSchema,
});

const createOrderRequestSchema = z.object({
  address_id: z.number().int(),
  voucher_id: z.number().int().optional(),
  store_id: z.number().int(),
  method_id: z.number().int(),
  foodIds: z.number().int().array(),
  message: z.string().nullable().optional(),
  payment_method: paymentTypeSchema,
});

const updateStatusRequestSchema = z.object({
  status: orderStatusSchema,
  order_id: z.number().int(),
});

type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
type GetInformationByFoodIdsRequest = z.infer<
  typeof getInformationByFoodIdsRequestSchema
>;
type UpdateStatusRequest = z.infer<typeof updateStatusRequestSchema>;

export {
  PAYMENT_TYPE,
  ORDER_STATUS,
  paymentTypeSchema,
  orderStatusSchema,
  getInformationByFoodIdsRequestSchema,
  createOrderRequestSchema,
  updateStatusRequestSchema,
  type CreateOrderRequest,
  type GetInformationByFoodIdsRequest,
  type UpdateStatusRequest,
};
