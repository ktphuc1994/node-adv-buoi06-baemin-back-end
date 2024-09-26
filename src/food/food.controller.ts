import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { FoodService } from './food.service';
import { ZodValidationPipe } from 'src/validation/zodValidationPipe';
import { Food, FoodRequest, foodRequestSchema } from 'src/validation/food';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(foodRequestSchema))
  getFood(@Query() foodFilter: FoodRequest): Promise<Food[]> {
    return this.foodService.getFood(foodFilter);
  }

  @Get('today')
  getTodayFood() {
    return this.foodService.getTodayFood();
  }
}
