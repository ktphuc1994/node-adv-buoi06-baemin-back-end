import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { EnhancedParseIntPipe } from 'src/pipes/parse-int.pipe';
import { Store } from 'src/validation/store/schema';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':storeId')
  getStoreDetail(
    @Param('storeId', EnhancedParseIntPipe) storeId: number,
  ): Promise<Store> {
    return this.storeService.getStoreDetail(storeId);
  }
}
