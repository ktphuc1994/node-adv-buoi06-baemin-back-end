import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/validation/zodValidationPipe';
import {
  CreateUserRequest,
  createUserRequestSchema,
  LoginRequest,
  loginRequestSchema,
} from 'src/validation/user/schema';
import { AccessToken } from 'src/types/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserRequestSchema))
  async register(@Body() newUser: CreateUserRequest): Promise<AccessToken> {
    return this.authService.register(newUser);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginRequestSchema))
  async login(@Body() loginInfo: LoginRequest): Promise<AccessToken> {
    const userInfo = await this.authService.validateUser(loginInfo);
    return this.authService.login(userInfo);
  }
}
