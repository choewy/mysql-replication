import { Article } from '@common/entities';
import { Repository } from 'typeorm';

export class ArticleQuery {
  constructor(private readonly repo: Repository<Article>) {}

  async hasArticleById(id: number) {
    return !!(await this.repo.findOne({
      select: ['id'],
      where: { id },
    }));
  }

  async findArticlesAndCount(skip = 0, take = 10) {
    return this.repo.findAndCount({
      relations: { user: true },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, email: true, nickname: true },
      },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async findArticleById(id: number) {
    return this.repo.findOne({
      relations: { user: true },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, email: true, nickname: true },
      },
      where: { id },
    });
  }

  async saveArticle(article: Article) {
    return this.repo.save(article);
  }

  async deleteArticle(id: number) {
    return this.repo.softDelete(id);
  }
}
