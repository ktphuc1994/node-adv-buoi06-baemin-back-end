import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Address,
  CreateUserRequest,
  createUserRequestSchema,
} from 'src/validation/user/schema';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getUserByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }

  createUser(userInfo: CreateUserRequest) {
    createUserRequestSchema.parse(userInfo);
    return this.prismaService.user.create({ data: userInfo });
  }

  getUserAddresses(user_id: number): Promise<Address[]> {
    return this.prismaService.address.findMany({
      where: { user_id },
    });
  }
}
