import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Address, UserInReq, UserProfile } from 'src/validation/user/schema';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('address')
  getUserAddresses(@Req() { user }: UserInReq): Promise<Address[]> {
    return this.userService.getUserAddresses(user.user_id);
  }

  @Get('profile')
  getUserProfile(@Req() { user }: UserInReq): Promise<UserProfile> {
    return this.userService.getUserProfile(user.user_id);
  }
}
