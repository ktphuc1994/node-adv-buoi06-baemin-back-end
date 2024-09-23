import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Menu } from 'src/validation/menu/schema';

@Injectable()
export class MenuService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMenuList(): Promise<Menu[]> {
    const menuList = await this.prismaService.menu.findMany({
      select: { menu_id: true, name: true, image: true },
    });
    return menuList;
  }
}
