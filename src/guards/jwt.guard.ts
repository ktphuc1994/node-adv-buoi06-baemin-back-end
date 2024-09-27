import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GUARD_KEY } from 'src/constants/guard';

@Injectable()
export class JwtGuard extends AuthGuard(GUARD_KEY.JWT) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // This method performs the actual JWT validation and authentication checks
  }
}
