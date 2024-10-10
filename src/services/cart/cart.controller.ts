import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserInReq } from 'src/validation/user/schema';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import {
  AddCartRequest,
  addCartRequestSchema,
  UpdateCartRequest,
  updateCartRequestSchema,
} from 'src/validation/cart/schema';
import { EnhancedParseIntPipe } from 'src/pipes/parse-int.pipe';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() { user }: UserInReq) {
    return this.cartService.getCart(user.user_id);
  }

  @Get('total')
  getCartTotalItems(@Req() { user }: UserInReq): Promise<number> {
    return this.cartService.getCartTotalItem(user.user_id);
  }

  @Post('add')
  @UsePipes(new ZodValidationPipe(addCartRequestSchema))
  addToCart(@Req() { user }: UserInReq, @Body() cartInfo: AddCartRequest) {
    return this.cartService.addToCart({ ...cartInfo, user_id: user.user_id });
  }

  @Put('update')
  @UsePipes(new ZodValidationPipe(updateCartRequestSchema))
  updateItemInCart(
    @Req() { user }: UserInReq,
    @Body() cartInfo: UpdateCartRequest,
  ) {
    return this.cartService.updateItemInCart({
      ...cartInfo,
      user_id: user.user_id,
    });
  }

  @Delete('remove/:foodId')
  removeCartItem(
    @Req() { user }: UserInReq,
    @Param('foodId', EnhancedParseIntPipe) foodId: number,
  ) {
    return this.cartService.removeCartItem(foodId, user.user_id);
  }
}
