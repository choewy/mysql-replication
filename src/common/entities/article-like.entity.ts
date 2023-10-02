import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';
import { Article } from './article.entity';

class Relations {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Article, (e) => e.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  article: Article;
}

@Entity({ name: ArticleLike.name })
export class ArticleLike extends Relations {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  readonly id: number;

  @CreateDateColumn()
  readonly likedAt: Date;
}
