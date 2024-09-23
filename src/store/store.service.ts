import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Store } from 'src/validation/store/schema';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStoreDetail(storeId: number): Promise<Store> {
    const storeInfo = await this.prismaService.store.findFirst({
      where: { store_id: storeId },
      omit: { created_at: true, updated_at: true },
    });

    if (!storeInfo) throw new NotFoundException('Store not found.');
    return storeInfo;
  }
}
