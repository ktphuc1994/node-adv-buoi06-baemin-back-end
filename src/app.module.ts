import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './services/menu/menu.module';
import { BannerModule } from './services/banner/banner.module';
import { FoodModule } from './services/food/food.module';
import { StoreModule } from './services/store/store.module';
import { UserModule } from './services/user/user.module';
import { CartModule } from './services/cart/cart.module';
import { AuthModule } from './services/auth/auth.module';
import { OrderModule } from './services/order/order.module';
import { VoucherModule } from './services/voucher/voucher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MenuModule,
    BannerModule,
    FoodModule,
    StoreModule,
    AuthModule,
    UserModule,
    CartModule,
    OrderModule,
    VoucherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
