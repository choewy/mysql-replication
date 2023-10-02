import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@common/guards';
import { RequestUserID } from '@common/decorators';
import { CreateArticleBodyDto, GetArticleParamDto, UpdateArticleBodyDto } from '@dto/article';

import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('latest')
  async getArticlesByLatest() {
    return this.articleService.getArticlesByLatest();
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

  @Patch(':id(\\d+)')
  @UseGuards(JwtGuard)
  async updateArticleById(
    @RequestUserID() userId: number,
    @Param() param: GetArticleParamDto,
    @Body() body: UpdateArticleBodyDto,
  ) {
    return this.articleService.updateArticle(userId, param.id, body);
  }

  @Delete(':id(\\d+)')
  @UseGuards(JwtGuard)
  async deleteArticleById(@RequestUserID() userId: number, @Param() param: GetArticleParamDto) {
    return this.articleService.deleteArticle(userId, param.id);
  }
}
