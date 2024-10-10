import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UserInReq } from 'src/validation/user/schema';
import {
  createOrderRequestSchema,
  CreateOrderRequest,
  GetInformationByFoodIdsRequest,
  getInformationByFoodIdsRequestSchema,
  orderStatusSchema,
  ORDER_STATUS,
  updateStatusRequestSchema,
  UpdateStatusRequest,
} from 'src/validation/order/schema';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';
import { EnhancedParseIntPipe } from 'src/pipes/parse-int.pipe';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('information-by-food-ids')
  getInformationByFoodIds(
    @Req() { user }: UserInReq,
    @Query() info: { foodIds: string; storeId: string },
  ) {
    let payload: GetInformationByFoodIdsRequest = {
      foodIds: [],
      storeId: -1,
    };
    try {
      payload = getInformationByFoodIdsRequestSchema.parse({
        foodIds: info.foodIds.split(','),
        storeId: info.storeId,
      });
    } catch (_error) {
      throw new BadRequestException(
        'Định dạng của storeId và foodIds phải là string integer.',
      );
    }
    return this.orderService.getInformationByFoodIds(
      user.user_id,
      payload.storeId,
      payload.foodIds,
    );
  }

  @Post('create')
  @UsePipes(new ZodValidationPipe(createOrderRequestSchema))
  placeOrder(
    @Req() { user }: UserInReq,
    @Body() orderInfo: CreateOrderRequest,
  ) {
    return this.orderService.placeOrder({
      ...orderInfo,
      user_id: user.user_id,
    });
  }

  @Get('detail/:orderId')
  getOrderDetail(
    @Req() { user }: UserInReq,
    @Param('orderId', EnhancedParseIntPipe) orderId: number,
  ) {
    return this.orderService.getOrderDetail(orderId, user.user_id);
  }

  @Patch('update-status')
  @UsePipes(new ZodValidationPipe(updateStatusRequestSchema))
  updateOrderStatus(
    @Req() { user }: UserInReq,
    @Body() { order_id, status }: UpdateStatusRequest,
  ) {
    return this.orderService.updateOrderStatus(order_id, user.user_id, status);
  }
}
