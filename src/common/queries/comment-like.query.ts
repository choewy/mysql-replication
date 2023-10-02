import { Repository } from 'typeorm';

import { CommentLike } from '@common/entities';

export class CommentLikeQuery {
  constructor(private readonly repo: Repository<CommentLike>) {}

  async hasByCommentAndUser(commentId: number, userId?: number) {
    if (!userId) {
      return false;
    }

    return !!(await this.repo.findOne({ select: ['commentId', 'userId'], where: { commentId, userId } }));
  }

  async countByComment(commentId: number) {
    return this.repo.count({ select: ['commentId'], where: { commentId } });
  }

  async upsertCommentLike(commentId: number, userId: number) {
    return this.repo.upsert({ commentId, userId }, { conflictPaths: { commentId: true, userId: true } });
  }

  async deleteCommentLike(commentId: number, userId: number) {
    return this.repo.delete({ commentId, userId });
  }
}
