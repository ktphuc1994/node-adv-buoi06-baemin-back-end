import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
} from 'src/validation/order/schema';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';

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
}
