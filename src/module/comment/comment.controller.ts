import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { CommentService } from './comment.service';
import { JwtGuard } from '@common/guards';
import { RequestUserID } from '@common/decorators';
import {
  CreateCommentBodyDto,
  GetCommentParamDto,
  GetCommentsByArticleParamDto,
  UpdateCommentBodyDto,
} from '@dto/comment';
import { GetListQueryDto } from '@dto/request';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':articleId(\\d+)')
  async getCommentsByArticle(@Param() param: GetCommentsByArticleParamDto, @Query() query?: GetListQueryDto) {
    return this.commentService.getCommentsByArticle(param, query);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createArticleComment(@RequestUserID() userId: number, @Body() body: CreateCommentBodyDto) {
    return this.commentService.createComment(userId, body);
  }

  @Patch()
  @UseGuards(JwtGuard)
  async updateComment(@RequestUserID() userId: number, @Body() body: UpdateCommentBodyDto) {
    return this.commentService.updateComment(userId, body);
  }

  @Delete(':id(\\d+)')
  @UseGuards(JwtGuard)
  async deleteComment(@RequestUserID() userId: number, @Param() param: GetCommentParamDto) {
    return this.commentService.deleteComment(userId, param);
  }
}
