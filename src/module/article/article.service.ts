import { DataSource, Repository } from 'typeorm';

import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { Article, Comment } from '@common/entities';
import { ArticleQuery, CommentQuery } from '@common/queries';
import { ResponseDto } from '@dto/response';
import { GetListQueryDto } from '@dto/request';
import { CreateArticleBodyDto, GetArticleParamDto, UpdateArticleBodyDto } from '@dto/article';

@Injectable()
export class ArticleService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectSlaveRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getArticles(query?: GetListQueryDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const commentQuery = new CommentQuery(this.commentRepository);

    const [articles, count] = await articleQuery.findArticlesAndCount(query?.skip, query?.take);

    for (const article of articles) {
      article.commentCount = await commentQuery.countByArticle(article.id);
    }

    return new ResponseDto(HttpStatus.OK, { count, articles });
  }

  async getArticleById(body: GetArticleParamDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const article = await articleQuery.findArticleById(body.id);

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${body.id}).`));
    }

    const commentQuery = new CommentQuery(this.commentRepository);
    const [comments, commentCount] = await commentQuery.findCommentsAndCountByArticle(article.id);

    article.commentCount = commentCount;
    article.comments = comments;

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
}
