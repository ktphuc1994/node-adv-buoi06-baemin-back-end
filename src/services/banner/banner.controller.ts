import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from 'src/validation/banner/schema';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  getAllBanner(): Promise<Banner[]> {
    return this.bannerService.getAllBanner();
  }
}
