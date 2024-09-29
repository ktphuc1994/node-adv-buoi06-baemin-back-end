import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user/user.service';
import {
  CreateUserRequest,
  LoginRequest,
  User,
} from 'src/validation/user/schema';
import * as bcrypt from 'bcrypt';
import { AccessToken, AccessTokenPayload } from 'src/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginInfo: LoginRequest): Promise<User> {
    const user = await this.userService.getUserByEmail(loginInfo.email);
    if (!user) {
      throw new BadRequestException('Người dùng đã tồn tại');
    }
    const isMatch: boolean = bcrypt.compareSync(
      loginInfo.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Email hoặc password không đúng');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload: AccessTokenPayload = {
      email: user.email,
      user_id: user.user_id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: CreateUserRequest): Promise<AccessToken> {
    const existingUser = await this.userService.getUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: CreateUserRequest = { ...user, password: hashedPassword };
    const createdUser = await this.userService.createUser(newUser);
    return this.login(createdUser);
  }
}
