import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { ArticleLike } from './article-like.entity';

class Relations {
  @ManyToOne(() => User, (e) => e.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Comment, (e) => e.article, {
    cascade: ['insert', 'soft-remove'],
  })
  @JoinTable()
  comments: Comment[];

  @OneToMany(() => ArticleLike, (e) => e.article, {
    cascade: ['insert', 'remove'],
  })
  @JoinTable()
  likes: ArticleLike[];
}

@Entity({ name: Article.name })
export class Article extends Relations {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  readonly id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 5012,
  })
  content: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date | null;
}
