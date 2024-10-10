import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateOrderRequest,
  ORDER_STATUS,
  orderStatusSchema,
} from 'src/validation/order/schema';
import { CartService } from '../cart/cart.service';
import { UnprocessableContentException } from 'src/exceptions/UnprocessableContent.exception';
import { VoucherService } from '../voucher/voucher.service';
import { FoodService } from '../food/food.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prismaErrorCodes } from 'src/constants/prisma';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
    private voucherService: VoucherService,
    private foodService: FoodService,
  ) {}

  async validateOrder(store_id: number, foodIds: number[]): Promise<void> {
    const foodList = await this.prismaService.food.findMany({
      where: { store_id, food_id: { in: foodIds } },
      select: { food_id: true },
    });

    if (foodList.length === 0 || foodList.length !== foodIds.length)
      throw new BadRequestException(
        'Món ăn (foodIds) và cửa hàng (storeId) không trùng khớp',
      );
  }

  async getInformationByFoodIds(
    user_id: number,
    store_id: number,
    foodIds: number[],
  ) {
    await this.validateOrder(store_id, foodIds);

    // check food in card
    const foodList = await this.cartService.validateCartItems(user_id, foodIds);
    if (!foodList)
      throw new BadRequestException('Món ăn không tồn tại trong giỏ hàng.');

    // check stock
    await this.foodService.checkStock(foodList);

    const voucherList = await this.voucherService.getVoucherList();

    // get store information
    const storeInfo = await this.prismaService.store.findFirst({
      where: { store_id },
      select: {
        store_id: true,
        name: true,
        shipping_partner: {
          select: {
            service_fee: true,
            shipping_partner_method: { include: { shipping_method: true } },
          },
        },
      },
    });

    if (!storeInfo)
      throw new BadRequestException(
        'Của hàng tương ứng với các món ăn không tồn tại.',
      );

    const shippingMethods =
      storeInfo.shipping_partner.shipping_partner_method.map(
        (shippingInfo) => shippingInfo.shipping_method,
      );

    const food = foodList.map((foodInfo) => ({
      ...foodInfo.food,
      food_id: foodInfo.food_id,
      quantity: foodInfo.quantity,
    }));

    return {
      store: {
        store_id: storeInfo.store_id,
        name: storeInfo.name,
        service_fee: storeInfo.shipping_partner.service_fee.toNumber(),
        shippingMethods,
      },
      food,
      voucherList,
    };
  }

  async placeOrder(orderInfo: CreateOrderRequest & { user_id: number }) {
    const { foodIds, ...createOrderInfo } = orderInfo;

    // kiểm address
    const addressInfo = await this.prismaService.address.findFirst({
      where: {
        address_id: orderInfo.address_id,
        user_id: orderInfo.user_id,
      },
    });
    if (!addressInfo)
      throw new BadRequestException(
        'Địa chỉ không có trong danh sách người dùng.',
      );

    // kiểm tra voucher
    let discountPercentage = 0;
    if (orderInfo.voucher_id) {
      const voucherInfo = await this.voucherService.getVoucherById(
        orderInfo.voucher_id,
      );
      if (!voucherInfo) throw new BadRequestException('Voucher không tồn tại.');

      discountPercentage = voucherInfo.percentage.toNumber() / 100;
    }

    // kiểm tra xem foodIds có trong cart không
    const foodRawList = await this.cartService.validateCartItems(
      orderInfo.user_id,
      foodIds,
    );
    if (!foodRawList)
      throw new BadRequestException('Món ăn không tồn tại trong giỏ hàng.');

    // Kiểm tra xem món ăn trong cùng 1 cửa hàng không
    await this.validateOrder(orderInfo.store_id, foodIds);

    const storeInfo = await this.prismaService.store.findFirst({
      where: {
        store_id: orderInfo.store_id,
        shipping_partner: {
          shipping_partner_method: {
            some: { method_id: orderInfo.method_id },
          },
        },
      },
      select: {
        store_id: true,
        shipping_partner: {
          select: {
            service_fee: true,
            shipping_partner_method: {
              where: { method_id: orderInfo.method_id },
              select: { shipping_method: { select: { shipping_price: true } } },
            },
          },
        },
      },
    });
    if (!storeInfo)
      throw new BadRequestException(
        'Phương thức vận chuyển không khả dụng với gian hàng.',
      );

    // kiểm tra stock
    const foodStock = await this.foodService.checkStock(foodRawList);

    // tính total_discount
    let total_discount = 0;
    let service_fee = 0;
    const orderFoodData = foodRawList.map((foodInfo) => {
      const total = foodInfo.food.price * foodInfo.quantity;
      total_discount += total * discountPercentage;
      service_fee +=
        (total * storeInfo.shipping_partner.service_fee.toNumber()) / 100;

      return {
        food_id: foodInfo.food_id,
        quantity: foodInfo.quantity,
        price_at_time_of_order: foodInfo.food.price,
      };
    });
    const orderPromise = this.prismaService.order.create({
      data: {
        ...createOrderInfo,
        status: orderStatusSchema.enum.PENDING,
        total_discount: Math.round(total_discount),
        service_fee: Math.round(service_fee),
        shipping_price:
          storeInfo.shipping_partner.shipping_partner_method[0].shipping_method
            .shipping_price,
        order_food: {
          createMany: { data: orderFoodData },
        },
      },
    });

    const updateStockQuery = foodStock.map((stockInfo) =>
      this.prismaService.food.update({
        where: { food_id: stockInfo.food_id },
        data: { stock: stockInfo.stock - stockInfo.quantity },
      }),
    );

    try {
      const [order] = await this.prismaService.$transaction([
        orderPromise,
        this.prismaService.cart.deleteMany({
          where: { user_id: orderInfo.user_id, food_id: { in: foodIds } },
        }),
        ...updateStockQuery,
      ]);

      return { order_id: order.order_id };
    } catch (_error) {
      throw new UnprocessableContentException(
        'Không thể tạo đơn hàng. Vui lòng thử lại sau.',
      );
    }
  }

  async getOrderDetail(order_id: number, user_id: number) {
    const orderInfo = await this.prismaService.order.findFirst({
      where: { order_id, user_id },
      select: {
        status: true,
        payment_method: true,
        shipping_price: true,
        service_fee: true,
        total_discount: true,
        user: { select: { first_name: true, last_name: true, phone: true } },
        address: { select: { full_address: true } },
        store: { select: { name: true } },
        order_food: {
          select: {
            price_at_time_of_order: true,
            quantity: true,
            food: { select: { image: true, name: true, description: true } },
          },
        },
      },
    });

    if (!orderInfo) throw new BadRequestException('Đơn hàng không tồn tại');

    const food = orderInfo.order_food.map((foodInfo) => ({
      ...foodInfo.food,
      quantity: foodInfo.quantity,
      price: foodInfo.price_at_time_of_order,
    }));

    return {
      status: orderInfo.status,
      payment_method: orderInfo.payment_method,
      shipping_price: orderInfo.shipping_price,
      service_fee: orderInfo.service_fee,
      total_discount: orderInfo.total_discount,
      user: orderInfo.user,
      address: orderInfo.address.full_address,
      store_name: orderInfo.store.name,
      food,
    };
  }

  async updateOrderStatus(
    order_id: number,
    user_id: number,
    status: ORDER_STATUS,
  ) {
    try {
      return await this.prismaService.order.update({
        where: { order_id, user_id },
        data: { status },
      });
    } catch (error) {
      if (
        !(error instanceof PrismaClientKnownRequestError) ||
        error.code !== prismaErrorCodes.notFound
      )
        throw new UnprocessableContentException(
          'Không thể cập nhật trạng thái đơn hàng. Xin hãy thử lại sau.',
        );

      throw new BadRequestException('Đơn hàng không tồn tại.');
    }
  }
}
