import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { DatabaseConfig, JwtConfig } from '@core/configs';
import { DatabaseType } from '@core/constants';
import { JwtGuard, JwtGuardStrategy } from '@common/guards';
import * as entities from '@common/entities';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '@module/auth';
import { UserModule } from '@module/user';
import { ArticleModule } from '@module/article';

const entityTargets = Object.values(entities);

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 30 }]),
    TypeOrmModule.forRoot(new DatabaseConfig('MASTER').getTypeOrmModuleOptions(entityTargets)),
    TypeOrmModule.forRoot(new DatabaseConfig('SLAVE').getTypeOrmModuleOptions(entityTargets, DatabaseType.SLAVE)),
    JwtModule.register(new JwtConfig('JWT').getJwtModuleOptions()),
    AuthModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService, ThrottlerGuard, JwtGuardStrategy, JwtGuard],
})
export class AppModule {}
