import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';

import { CommentService } from './comment.service';
import { JwtRequiredGuard, JwtOptionalGuard } from '@common/guards';
import { RequestUserID } from '@common/decorators';
import {
  CreateCommentBodyDto,
  GetCommentParamDto,
  GetCommentsByArticleParamDto,
  LikeOrUnLikeCommentBodyDto,
  UpdateCommentBodyDto,
} from '@dto/comment';
import { GetListQueryDto } from '@dto/request';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':articleId(\\d+)')
  @UseGuards(JwtOptionalGuard)
  async getCommentsByArticle(@Param() param: GetCommentsByArticleParamDto, @Query() query?: GetListQueryDto) {
    return this.commentService.getCommentsByArticle(param, query);
  }

  @Post()
  @UseGuards(JwtRequiredGuard)
  async createArticleComment(@RequestUserID() userId: number, @Body() body: CreateCommentBodyDto) {
    return this.commentService.createComment(userId, body);
  }

  @Patch()
  @UseGuards(JwtRequiredGuard)
  async updateComment(@RequestUserID() userId: number, @Body() body: UpdateCommentBodyDto) {
    return this.commentService.updateComment(userId, body);
  }

  @Put()
  @UseGuards(JwtRequiredGuard)
  async likeOrUnLikeArticle(@RequestUserID() userId: number, @Body() body: LikeOrUnLikeCommentBodyDto) {
    return this.commentService.likeOrUnLikeComment(userId, body);
  }

  @Delete(':id(\\d+)')
  @UseGuards(JwtRequiredGuard)
  async deleteComment(@RequestUserID() userId: number, @Param() param: GetCommentParamDto) {
    return this.commentService.deleteComment(userId, param);
  }
}
