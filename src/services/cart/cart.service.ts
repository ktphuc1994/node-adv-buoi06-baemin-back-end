import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prismaErrorCodes } from 'src/constants/prisma';
import { UnprocessableContentException } from 'src/exceptions/UnprocessableContent.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkIsArrayDuplicated } from 'src/utils/common';
import { AddCartRequest, UpdateCartRequest } from 'src/validation/cart/schema';
import { FoodService } from '../food/food.service';

@Injectable()
export class CartService {
  constructor(
    private prismaService: PrismaService,
    private foodService: FoodService,
  ) {}

  async getCart(user_id: number) {
    const storeList = await this.prismaService.store.findMany({
      where: { food: { some: { cart: { some: { user_id } } } } },
      select: {
        store_id: true,
        name: true,
        food: {
          where: { cart: { some: { user_id } } },
          select: {
            food_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            cart: { where: { user_id }, select: { quantity: true } },
          },
        },
      },
    });

    const result = storeList.map((store) => {
      const foodList = store.food.map((foodInfo) => ({
        food_id: foodInfo.food_id,
        name: foodInfo.name,
        description: foodInfo.description,
        price: foodInfo.price,
        quantity: foodInfo.cart[0].quantity,
        stock: foodInfo.stock,
      }));
      return { ...store, food: foodList };
    });

    return result;
  }

  getCartTotalItem(user_id: number): Promise<number> {
    return this.prismaService.cart.count({ where: { user_id } });
  }

  async addToCart(cartInfo: AddCartRequest & { user_id: number }) {
    const { user_id, food_id } = cartInfo;
    const existItem = await this.prismaService.cart.findFirst({
      where: { user_id, food_id },
    });

    const { stock } = await this.foodService.getFoodDetail(cartInfo.food_id);
    if (stock === 0) throw new BadRequestException('Món ăn đã hết hàng.');

    if (!existItem)
      return this.prismaService.cart.create({
        data: { user_id, food_id, quantity: 1 },
      });

    if (stock <= existItem.quantity)
      throw new BadRequestException(
        `Số lượng món được đặt tối đa là ${stock}.`,
      );

    return this.prismaService.cart.update({
      where: { user_id_food_id: { user_id, food_id } },
      data: { quantity: existItem.quantity + 1, updated_at: new Date() },
    });
  }

  async updateItemInCart(cartInfo: UpdateCartRequest & { user_id: number }) {
    const { user_id, food_id, quantity } = cartInfo;

    const existItem = await this.prismaService.cart.findFirst({
      where: { user_id, food_id },
    });
    if (!existItem)
      throw new BadRequestException('Món ăn không tồn tại trong giỏ hàng.');

    const { stock } = await this.foodService.getFoodDetail(cartInfo.food_id);
    if (stock === 0) throw new BadRequestException('Món ăn đã hết hàng.');

    if (stock < cartInfo.quantity)
      throw new BadRequestException(
        `Số lượng món được đặt tối đa là ${stock}.`,
      );

    return this.prismaService.cart.update({
      where: { user_id_food_id: { user_id, food_id } },
      data: { quantity, updated_at: new Date() },
    });
  }

  async removeCartItem(food_id: number, user_id: number) {
    try {
      await this.prismaService.cart.delete({
        where: { user_id_food_id: { food_id, user_id } },
      });
      return 'Success';
    } catch (error) {
      if (
        !(error instanceof PrismaClientKnownRequestError) ||
        error.code !== prismaErrorCodes.notFound
      )
        throw new UnprocessableContentException(
          'Không thể xóa món ăn. Xin hãy thử lại sau.',
        );

      throw new BadRequestException(
        'Không thể xóa món ăn. Món ăn không tồn tại trong giỏ hàng.',
      );
    }
  }

  async validateCartItems(user_id: number, foodIds: number[]) {
    if (checkIsArrayDuplicated(foodIds))
      throw new BadRequestException('Món ăn bị trùng.');

    const cartFoodList = await this.prismaService.cart.findMany({
      where: { user_id, food_id: { in: foodIds } },
      select: {
        food_id: true,
        quantity: true,
        food: {
          select: { name: true, price: true, image: true, description: true },
        },
      },
    });

    if (cartFoodList.length !== foodIds.length) return null;
    return cartFoodList;
  }
}
