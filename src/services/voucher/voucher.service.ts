import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VoucherService {
  constructor(private prismaService: PrismaService) {}

  getVoucherById(voucher_id: number) {
    return this.prismaService.voucher.findFirst({ where: { voucher_id } });
  }

  getVoucherList() {
    return this.prismaService.voucher.findMany();
  }
}
