import { Repository } from 'typeorm';

import { CommentLike } from '@common/entities';

export class CommentLikeQuery {
  constructor(private readonly repo: Repository<CommentLike>) {}

  async hasByCommentAndUser(commentId: number, userId?: number) {
    if (!userId) {
      return false;
    }

    return !!(await this.repo.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    }));
  }

  async countByComment(commentId: number) {
    return this.repo.count({
      select: { comment: { id: true } },
      where: { comment: { id: commentId } },
    });
  }

  async upsertCommentLike(commentId: number, userId: number) {
    return this.repo.upsert(
      { comment: { id: commentId }, user: { id: userId } },
      { conflictPaths: { comment: true, user: true } },
    );
  }

  async deleteCommentLike(commentId: number, userId: number) {
    return this.repo.delete({
      comment: { id: commentId },
      user: { id: userId },
    });
  }
}
