import { BadRequestException, Injectable } from '@nestjs/common';
import { FOOD_TAGS } from 'src/constants/food';
import { PrismaService } from 'src/prisma/prisma.service';
import { filterPageAndPageSize } from 'src/utils/common';
import {
  CheckStockRequest,
  CheckStockResponse,
  Food,
  FoodRequest,
  TodayFood,
} from 'src/validation/food/schema';

@Injectable()
export class FoodService {
  constructor(private readonly prismaService: PrismaService) {}

  getFood(foodFilter: FoodRequest): Promise<Food[]> {
    const takeSkip = filterPageAndPageSize(
      foodFilter.page,
      foodFilter.pageSize,
    );
    const menuFoodFilter = foodFilter.menuId
      ? { menu_food: { some: { menu_id: foodFilter?.menuId } } }
      : {};

    return this.prismaService.food.findMany({
      where: {
        name: { contains: foodFilter?.foodName, mode: 'insensitive' },
        store_id: foodFilter?.storeId,
        ...menuFoodFilter,
      },
      ...takeSkip,
    });
  }

  getTodayFood(): Promise<TodayFood[]> {
    return this.prismaService.$queryRaw<TodayFood[]>`
      SELECT
      food.food_id,
      food.name,
      food.image,
      store.name AS store_name,
      store.address AS store_address,
      store.store_id As store_id
      FROM food
      JOIN store ON food.store_id = store.store_id
      WHERE ${FOOD_TAGS.TODAY} = ANY(food.tags);
    `;
  }

  async getFoodDetail(food_id: number) {
    const foodInfo = await this.prismaService.food.findFirst({
      where: { food_id },
    });
    if (!foodInfo) throw new BadRequestException('Món ăn không tồn tại.');

    return foodInfo;
  }

  async checkStock(
    requestInfo: CheckStockRequest[],
  ): Promise<CheckStockResponse[]> {
    const foodQuantity: Record<number, number> = {};
    const foodIdList: number[] = [];
    for (let foodInfo of requestInfo) {
      foodQuantity[foodInfo.food_id] = foodInfo.quantity;
      foodIdList.push(foodInfo.food_id);
    }

    const foodList = await this.prismaService.food.findMany({
      where: { food_id: { in: foodIdList } },
      select: { food_id: true, name: true, stock: true },
    });

    if (foodList.length === 0)
      throw new BadRequestException('Món ăn không tồn tại.');
    if (foodIdList.length !== requestInfo.length)
      throw new BadRequestException(
        'Danh sách có món ăn không tồn tại hoặc bị trùng lập.',
      );

    let errorMessage = '';
    const FoodQuantityAndStock = foodList.map(
      ({ food_id, name: foodName, stock }) => {
        const quantity = foodQuantity[food_id];
        if (stock < quantity) {
          errorMessage += `${foodName} (id: ${food_id}) không đủ hàng,`;
        }
        return { food_id, stock, quantity };
      },
    );

    if (errorMessage) throw new BadRequestException(errorMessage);

    return FoodQuantityAndStock;
  }
}
