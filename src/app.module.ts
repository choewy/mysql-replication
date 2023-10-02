import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseConfig } from '@core/configs';
import { DatabaseType } from '@core/constants';
import * as entities from '@common/entities';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@module/user';

const entityTargets = Object.values(entities);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(new DatabaseConfig('MASTER').getTypeOrmModuleOptions(entityTargets)),
    TypeOrmModule.forRoot(new DatabaseConfig('SLAVE').getTypeOrmModuleOptions(entityTargets, DatabaseType.SLAVE)),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
