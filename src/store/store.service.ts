import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreAndMenu } from 'src/validation/store/schema';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStoreDetail(storeId: number): Promise<StoreAndMenu> {
    const storeInfoPromise = this.prismaService.store.findFirst({
      where: { store_id: storeId },
      include: {
        shipping_partner: { select: { partner_name: true, service_fee: true } },
      },
      omit: { created_at: true, updated_at: true },
    });
    const menuListPromise = this.prismaService.menu.findMany({
      where: { menu_food: { some: { food: { store_id: storeId } } } },
      select: { menu_id: true, name: true },
    });
    const [storeInfo, menuList] = await Promise.all([
      storeInfoPromise,
      menuListPromise,
    ]);

    if (!storeInfo) throw new NotFoundException('Store not found.');
    return { ...storeInfo, menuList };
  }
}
