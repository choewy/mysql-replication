import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtOptionalGuard, JwtRequiredGuard } from '@common/guards';
import { RequestUserID } from '@common/decorators';
import { CreateArticleBodyDto, GetArticleParamDto, UpdateArticleBodyDto } from '@dto/article';
import { GetListQueryDto } from '@dto/request';

import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(JwtOptionalGuard)
  async getArticles(@RequestUserID() userId: number, @Query() query?: GetListQueryDto) {
    return this.articleService.getArticles(userId, query);
  }

  @Get(':id(\\d+)')
  @UseGuards(JwtOptionalGuard)
  async getArticleById(@RequestUserID() userId: number, @Param() param: GetArticleParamDto) {
    return this.articleService.getArticleById(userId, param);
  }

  @Post()
  @UseGuards(JwtRequiredGuard)
  async createArticle(@RequestUserID() userId: number, @Body() body: CreateArticleBodyDto) {
    return this.articleService.createArticle(userId, body);
  }

  @Patch()
  @UseGuards(JwtRequiredGuard)
  async updateArticleById(@RequestUserID() userId: number, @Body() body: UpdateArticleBodyDto) {
    return this.articleService.updateArticle(userId, body);
  }

  @Delete(':id(\\d+)')
  @UseGuards(JwtRequiredGuard)
  async deleteArticleById(@RequestUserID() userId: number, @Param() param: GetArticleParamDto) {
    return this.articleService.deleteArticle(userId, param);
  }
}
