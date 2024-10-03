import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Banner } from 'src/validation/banner/schema';

@Injectable()
export class BannerService {
  constructor(private readonly prismaService: PrismaService) {}

  getAllBanner(): Promise<Banner[]> {
    return this.prismaService.banner.findMany({
      omit: { created_at: true, updated_at: true },
    });
  }
}
