import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { FoodService } from './food.service';
import {
  Food,
  FoodRequest,
  foodRequestSchema,
  TodayFood,
} from 'src/validation/food/schema';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(foodRequestSchema))
  getFood(@Query() foodFilter: FoodRequest): Promise<Food[]> {
    return this.foodService.getFood(foodFilter);
  }

  @Get('today')
  getTodayFood(): Promise<TodayFood[]> {
    return this.foodService.getTodayFood();
  }
}
