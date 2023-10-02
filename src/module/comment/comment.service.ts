import { DataSource, Repository } from 'typeorm';
import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { Article, Comment } from '@common/entities';
import {
  CreateCommentBodyDto,
  GetCommentParamDto,
  GetCommentsByArticleParamDto,
  UpdateCommentBodyDto,
} from '@dto/comment';
import { GetListQueryDto } from '@dto/request';
import { ArticleQuery, CommentQuery } from '@common/queries';
import { ResponseDto } from '@dto/response';

@Injectable()
export class CommentService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectSlaveRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getCommentsByArticle(param: GetCommentsByArticleParamDto, query?: GetListQueryDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);

    if (!(await articleQuery.hasArticleById(param.articleId))) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${param.articleId}).`));
    }

    const commentQuery = new CommentQuery(this.commentRepository);
    const [comments, count] = await commentQuery.findCommentsAndCountByArticle(
      param.articleId,
      query?.skip,
      query?.take,
    );

    return new ResponseDto(HttpStatus.OK, { count, comments });
  }

  async createComment(userId: number, body: CreateCommentBodyDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);

    if (!(await articleQuery.hasArticleById(body.articleId))) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${body.articleId}).`));
    }

    const commentRepository = this.dataSource.getRepository(Comment);
    const comment = await new CommentQuery(commentRepository).saveComment(
      commentRepository.create({
        user: { id: userId },
        article: { id: body.articleId },
        comment: body.comment,
      }),
    );

    return new ResponseDto(HttpStatus.CREATED, { id: comment.id });
  }

  async updateComment(userId: number, body: UpdateCommentBodyDto) {
    const commentQuery = new CommentQuery(this.commentRepository);
    const comment = await commentQuery.findCommentById(body.id);

    if (!comment) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found comment(id: ${body.id}).`));
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException(new ResponseDto(HttpStatus.FORBIDDEN, 'access denined.'));
    }

    const commentRepository = this.dataSource.getRepository(Comment);
    await new CommentQuery(commentRepository).saveComment(
      commentRepository.create({ id: body.id, comment: body.comment }),
    );

    return new ResponseDto(HttpStatus.OK);
  }

  async deleteComment(userId: number, param: GetCommentParamDto) {
    const commentQuery = new CommentQuery(this.commentRepository);
    const comment = await commentQuery.findCommentById(param.id);

    if (!comment) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found comment(id: ${param.id}).`));
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException(new ResponseDto(HttpStatus.FORBIDDEN, 'access denined.'));
    }

    const commentRepository = this.dataSource.getRepository(Comment);
    await new CommentQuery(commentRepository).deleteComment(param.id);

    return new ResponseDto(HttpStatus.OK);
  }
}
