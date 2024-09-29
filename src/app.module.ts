import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { BannerModule } from './banner/banner.module';
import { FoodModule } from './food/food.module';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, MenuModule, BannerModule, FoodModule, StoreModule, AuthModule, UserModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
