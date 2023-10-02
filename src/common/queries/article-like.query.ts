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
}
