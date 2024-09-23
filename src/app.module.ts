import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { BannerModule } from './banner/banner.module';
import { FoodModule } from './food/food.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, MenuModule, BannerModule, FoodModule, StoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
