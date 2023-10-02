import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseType } from '@core/constants';
import { User } from '@common/entities';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], DatabaseType.SLAVE)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
