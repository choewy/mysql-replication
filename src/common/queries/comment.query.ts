import { Repository } from 'typeorm';

import { Comment } from '@common/entities';

export class CommentQuery {
  constructor(private readonly repo: Repository<Comment>) {}

  async findCommentById(id: number) {
    return this.repo.findOne({
      relations: { user: true },
      select: { user: { id: true } },
      where: { id },
    });
  }

  async countByArticle(articleId: number) {
    return this.repo.count({
      relations: { article: true },
      select: { article: { id: true } },
      where: { article: { id: articleId } },
    });
  }

  async findCommentsAndCountByArticle(articleId: number, skip = 0, take = 10) {
    return this.repo.findAndCount({
      relations: { article: true, user: true },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
        article: { id: true },
        user: { id: true, nickname: true, email: true },
      },
      where: { article: { id: articleId } },
      skip,
      take,
    });
  }

  async saveComment(comment: Comment) {
    return this.repo.save(comment);
  }

  async deleteComment(id: number) {
    return this.repo.softDelete(id);
  }
}
