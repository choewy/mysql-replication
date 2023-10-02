import { Repository } from 'typeorm';

import { ArticleLike } from '@common/entities';

export class ArticleLikeQuery {
  constructor(private readonly repo: Repository<ArticleLike>) {}

  async hasByArticleAndUser(articleId: number, userId?: number) {
    if (!userId) {
      return false;
    }

    return !!(await this.repo.findOne({
      where: {
        article: { id: articleId },
        user: { id: userId },
      },
    }));
  }

  async countByArticle(articleId: number) {
    return this.repo.count({
      select: { article: { id: true } },
      where: { article: { id: articleId } },
    });
  }

  async upsertArticleLike(articleId: number, userId: number) {
    return this.repo.upsert(
      { article: { id: articleId }, user: { id: userId } },
      { conflictPaths: { article: true, user: true } },
    );
  }

  async deleteArticleLike(articleId: number, userId: number) {
    return this.repo.delete({
      article: { id: articleId },
      user: { id: userId },
    });
  }
}
