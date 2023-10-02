import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';
import { CommentLike } from './comment-like.entity';

class Relations {
  @ManyToOne(() => User, (e) => e.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Article, (e) => e.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  article: Article;

  @ManyToOne(() => CommentLike, (e) => e.comment, {
    cascade: ['insert', 'remove'],
  })
  @JoinTable()
  likes: CommentLike[];
}

@Entity({ name: Comment.name })
export class Comment extends Relations {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  readonly id: number;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  comment: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date | null;
}
