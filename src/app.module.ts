import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseConfig } from '@core/configs';

import { DatabaseType } from '@core/constants';
import { User } from '@common/entities';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@module/user';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(new DatabaseConfig('MASTER').getTypeOrmModuleOptions([User])),
    TypeOrmModule.forRoot(new DatabaseConfig('SLAVE').getTypeOrmModuleOptions([User], DatabaseType.SLAVE)),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
