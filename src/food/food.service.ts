import { Injectable } from '@nestjs/common';
import { FOOD_TAGS } from 'src/constants/food';
import { PrismaService } from 'src/prisma/prisma.service';
import { filterPageAndPageSize } from 'src/utils/common';
import { FoodRequest, TodayFood } from 'src/validation/food';

@Injectable()
export class FoodService {
  constructor(private readonly prismaService: PrismaService) {}

  getFood(foodFilter: FoodRequest) {
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
}
