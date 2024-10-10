import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Address,
  CreateUserRequest,
  createUserRequestSchema,
  UserProfile,
  userProfileSchema,
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

  async getUserProfile(user_id: number): Promise<UserProfile> {
    const userInfo = await this.prismaService.user.findFirst({
      where: { user_id },
      include: { address: true },
    });
    if (!userInfo) throw new NotFoundException('Người dùng không tồn tại.');

    try {
      return userProfileSchema.parse(userInfo);
    } catch (error) {
      throw new ConflictException(
        'Có sự sai lệnh trong dữ liệu thông tin người dùng. Vui lòng liên hệ chăm sóc khách hàng để được hỗ trợ.',
      );
    }
  }
}
