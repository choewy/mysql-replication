import { Observable } from 'rxjs';

import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResponseDto } from '@dto/response';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, _: any, context: ExecutionContext): TUser {
    if (err || !user) {
      throw new UnauthorizedException(new ResponseDto(HttpStatus.UNAUTHORIZED, err || 'invalid jwt.'));
    }

    context.switchToHttp().getRequest().userId = user.id;

    return user;
  }
}
