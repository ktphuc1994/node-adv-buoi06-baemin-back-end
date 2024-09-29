import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from 'src/validation/menu/schema';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenuList(): Promise<Menu[]> {
    return this.menuService.getMenuList();
  }
}
