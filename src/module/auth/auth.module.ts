import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseType } from '@core/constants';
import { User } from '@common/entities';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from '@common/services';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => JwtModule), TypeOrmModule.forFeature([User], DatabaseType.SLAVE)],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
})
export class AuthModule {}
