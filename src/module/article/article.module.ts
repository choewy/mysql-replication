import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseType } from '@core/constants';
import { Article, ArticleLike, Comment } from '@common/entities';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleLike, Comment], DatabaseType.SLAVE)],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
