import { DataSource, Repository } from 'typeorm';

import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { Article, Comment } from '@common/entities';
import { ArticleQuery, CommentQuery } from '@common/queries';
import { ResponseDto } from '@dto/response';
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

  async getArticlesByLatest() {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const commentQuery = new CommentQuery(this.commentRepository);

    const [articles, count] = await articleQuery.findArticlesAndCountByLatest();

    for (const article of articles) {
      article.commentCount = await commentQuery.countByArticle(article.id);
    }

    return new ResponseDto(HttpStatus.OK, { count, articles });
  }

  async getArticleById(dto: GetArticleParamDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const article = await articleQuery.findArticleById(dto.id);

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${dto.id}).`));
    }

    const commentQuery = new CommentQuery(this.commentRepository);
    const [comments, commentCount] = await commentQuery.findCommentsAndCountByArticle(article.id);

    article.commentCount = commentCount;
    article.comments = comments;

    return new ResponseDto(HttpStatus.OK, article);
  }

  async createArticle(userId: number, dto: CreateArticleBodyDto) {
    const articleRepository = this.dataSource.getRepository(Article);
    const article = await new ArticleQuery(articleRepository).saveArticle(
      articleRepository.create({
        user: { id: userId },
        title: dto.title,
        content: dto.content,
      }),
    );

    return new ResponseDto(HttpStatus.CREATED, { id: article.id });
  }

  async updateArticle(userId: number, articleId: number, dto: UpdateArticleBodyDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const article = await articleQuery.findArticleById(articleId);

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${articleId}).`));
    }

    if (article.user.id !== userId) {
      throw new ForbiddenException(new ResponseDto(HttpStatus.FORBIDDEN, 'access denined.'));
    }

    const articleRepository = this.dataSource.getRepository(Article);
    await new ArticleQuery(articleRepository).saveArticle(
      articleRepository.create({
        id: articleId,
        title: dto.title || undefined,
        content: dto.content || undefined,
      }),
    );

    return new ResponseDto(HttpStatus.OK, { id: articleId });
  }

  async deleteArticle(userId: number, articleId: number) {
    const articleQuery = new ArticleQuery(this.articleRepository);
    const article = await articleQuery.findArticleById(articleId);

    if (!article) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${articleId}).`));
    }

    if (article.user.id !== userId) {
      throw new ForbiddenException(new ResponseDto(HttpStatus.FORBIDDEN, 'access denined.'));
    }

    const articleRepository = this.dataSource.getRepository(Article);
    await new ArticleQuery(articleRepository).deleteArticle(articleId);

    return new ResponseDto(HttpStatus.OK, { id: articleId });
  }
}
