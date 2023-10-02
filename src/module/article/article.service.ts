import { DataSource, Repository } from 'typeorm';

import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { Article, ArticleLike, Comment } from '@common/entities';
import { ArticleLikeQuery, ArticleQuery, CommentQuery } from '@common/queries';
import { ResponseDto } from '@dto/response';
import { GetListQueryDto } from '@dto/request';
import {
  ArticleResponseDto,
  CreateArticleBodyDto,
  GetArticleParamDto,
  LikeOrUnLikeArticleBodyDto,
  UpdateArticleBodyDto,
} from '@dto/article';

@Injectable()
export class ArticleService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectSlaveRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    @InjectSlaveRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getArticles(userId?: number, query?: GetListQueryDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const articleLikeQuery = new ArticleLikeQuery(this.articleLikeRepository);
    const commentQuery = new CommentQuery(this.commentRepository);

    const [articles, count] = await articleQuery.findArticlesAndCount(query?.skip, query?.take);

    for (const article of articles as ArticleResponseDto[]) {
      article.hasLike = await articleLikeQuery.hasByArticleAndUser(article.id, userId);
      article.likeCount = await articleLikeQuery.countByArticle(article.id);
      article.commentCount = await commentQuery.countByArticle(article.id);
    }

    return new ResponseDto(HttpStatus.OK, { count, articles });
  }

  async getArticleById(userId: number | undefined, body: GetArticleParamDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const articleLikeQuery = new ArticleLikeQuery(this.articleLikeRepository);
    const article = (await articleQuery.findArticleById(body.id)) as ArticleResponseDto;

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${body.id}).`));
    }

    const commentQuery = new CommentQuery(this.commentRepository);

    article.hasLike = await articleLikeQuery.hasByArticleAndUser(article.id, userId);
    article.likeCount = await articleLikeQuery.countByArticle(article.id);
    article.commentCount = await commentQuery.countByArticle(article.id);

    return new ResponseDto(HttpStatus.OK, article);
  }

  async createArticle(userId: number, body: CreateArticleBodyDto) {
    const articleRepository = this.dataSource.getRepository(Article);
    const article = await new ArticleQuery(articleRepository).saveArticle(
      articleRepository.create({
        user: { id: userId },
        title: body.title,
        content: body.content,
      }),
    );

    return new ResponseDto(HttpStatus.CREATED, { id: article.id });
  }

  async updateArticle(userId: number, body: UpdateArticleBodyDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const article = await articleQuery.findArticleById(body.id);

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${body.id}).`));
    }

    if (article.user.id !== userId) {
      throw new ForbiddenException(new ResponseDto(HttpStatus.FORBIDDEN, 'access denined.'));
    }

    const articleRepository = this.dataSource.getRepository(Article);
    await new ArticleQuery(articleRepository).saveArticle(
      articleRepository.create({
        id: body.id,
        title: body.title || undefined,
        content: body.content || undefined,
      }),
    );

    return new ResponseDto(HttpStatus.OK);
  }

  async deleteArticle(userId: number, param: GetArticleParamDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const article = await articleQuery.findArticleById(param.id);

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${param.id}).`));
    }

    if (article.user.id !== userId) {
      throw new ForbiddenException(new ResponseDto(HttpStatus.FORBIDDEN, 'access denined.'));
    }

    const articleRepository = this.dataSource.getRepository(Article);
    await new ArticleQuery(articleRepository).deleteArticle(param.id);

    return new ResponseDto(HttpStatus.OK);
  }

  async likeOrUnLikeArticle(userId: number, body: LikeOrUnLikeArticleBodyDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);

    if (!(await articleQuery.hasArticleById(body.id))) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${body.id}).`));
    }

    const articleLikeRepository = this.dataSource.getRepository(ArticleLike);
    const articleLikeQuery = new ArticleLikeQuery(articleLikeRepository);

    body.like
      ? await articleLikeQuery.upsertArticleLike(body.id, userId)
      : await articleLikeQuery.deleteArticleLike(body.id, userId);

    return new ResponseDto(HttpStatus.OK);
  }
}
