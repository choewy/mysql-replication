import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseType } from '@core/constants';
import { Article, Comment, CommentLike } from '@common/entities';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Comment, CommentLike], DatabaseType.SLAVE)],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
