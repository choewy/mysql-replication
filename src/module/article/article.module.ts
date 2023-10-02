import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseType } from '@core/constants';
import { Article, Comment } from '@common/entities';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment], DatabaseType.SLAVE)],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
