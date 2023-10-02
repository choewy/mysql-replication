import { ExtractJwt, Strategy } from 'passport-jwt';

import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtConfig } from '@core/configs';
import { ResponseDto } from '@dto/response';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new JwtConfig('JWT').getSecret(),
    });
  }

  async validate(payload) {
    if (!payload) {
      throw new UnauthorizedException(new ResponseDto(HttpStatus.UNAUTHORIZED, 'unauthorized.'));
    }

    return payload;
  }
}
