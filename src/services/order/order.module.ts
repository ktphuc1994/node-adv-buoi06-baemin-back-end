import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [CartModule, VoucherModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
