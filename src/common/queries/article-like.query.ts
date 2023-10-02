import { Repository } from 'typeorm';

import { ArticleLike } from '@common/entities';

export class ArticleLikeQuery {
  constructor(private readonly repo: Repository<ArticleLike>) {}

  async hasByArticleAndUser(articleId: number, userId?: number) {
    if (!userId) {
      return false;
    }

    return !!(await this.repo.findOne({ select: ['articleId', 'userId'], where: { articleId, userId } }));
  }

  async countByArticle(articleId: number) {
    return this.repo.count({ select: ['articleId'], where: { articleId } });
  }

  async upsertArticleLike(articleId: number, userId: number) {
    return this.repo.upsert({ articleId, userId }, { conflictPaths: { articleId: true, userId: true } });
  }

  async deleteArticleLike(articleId: number, userId: number) {
    return this.repo.delete({ articleId, userId });
  }
}
