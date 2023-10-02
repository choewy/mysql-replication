import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@common/guards';
import { RequestUserID } from '@common/decorators';
import { CreateArticleBodyDto, GetArticleParamDto, UpdateArticleBodyDto } from '@dto/article';
import { GetListQueryDto } from '@dto/request';

import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticles(@Query() query?: GetListQueryDto) {
    return this.articleService.getArticles(query);
  }

  @Get(':id(\\d+)')
  async getArticleById(@Param() param: GetArticleParamDto) {
    return this.articleService.getArticleById(param);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createArticle(@RequestUserID() userId: number, @Body() body: CreateArticleBodyDto) {
    return this.articleService.createArticle(userId, body);
  }

  @Patch()
  @UseGuards(JwtGuard)
  async updateArticleById(@RequestUserID() userId: number, @Body() body: UpdateArticleBodyDto) {
    return this.articleService.updateArticle(userId, body);
  }

  @Delete(':id(\\d+)')
  @UseGuards(JwtGuard)
  async deleteArticleById(@RequestUserID() userId: number, @Param() param: GetArticleParamDto) {
    return this.articleService.deleteArticle(userId, param);
  }
}
