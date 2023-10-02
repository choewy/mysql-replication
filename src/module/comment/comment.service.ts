import { DataSource, Repository } from 'typeorm';
import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { Article, Comment, CommentLike } from '@common/entities';
import {
  CommentResponseDto,
  CreateCommentBodyDto,
  GetCommentParamDto,
  GetCommentsByArticleParamDto,
  LikeOrUnLikeCommentBodyDto,
  UpdateCommentBodyDto,
} from '@dto/comment';
import { GetListQueryDto } from '@dto/request';
import { ArticleQuery, CommentLikeQuery, CommentQuery } from '@common/queries';
import { ResponseDto } from '@dto/response';

@Injectable()
export class CommentService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectSlaveRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectSlaveRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async getCommentsByArticle(userId: number | undefined, param: GetCommentsByArticleParamDto, query?: GetListQueryDto) {
    const articleQuery = new ArticleQuery(this.articleRepository);

    if (!(await articleQuery.hasArticleById(param.articleId))) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found article(id: ${param.articleId}).`));
    }

    const commentQuery = new CommentQuery(this.commentRepository);
    const commentLikeQuery = new CommentLikeQuery(this.commentLikeRepository);

    const [comments, count] = await commentQuery.findCommentsAndCountByArticle(
      param.articleId,
      query?.skip,
      query?.take,
    );

    for (const comment of comments as CommentResponseDto[]) {
      comment.likeCount = await commentLikeQuery.countByComment(comment.id);
      comment.hasLike = await commentLikeQuery.hasByCommentAndUser(comment.id, userId);
    }

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

  async likeOrUnLikeComment(userId: number, body: LikeOrUnLikeCommentBodyDto) {
    const commentQuery = new CommentQuery(this.commentRepository);

    if (!(await commentQuery.hasCommentById(body.id))) {
      throw new NotFoundException(new ResponseDto(HttpStatus.NOT_FOUND, `not found comment(id: ${body.id}).`));
    }

    const commentLikeRepository = this.dataSource.getRepository(CommentLike);
    const commentLikeQuery = new CommentLikeQuery(commentLikeRepository);

    body.like
      ? await commentLikeQuery.upsertCommentLike(body.id, userId)
      : await commentLikeQuery.deleteCommentLike(body.id, userId);

    return new ResponseDto(HttpStatus.OK);
  }
}
