import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';

class Relations {
  @OneToMany(() => Article, (e) => e.user, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  @JoinTable()
  articles: Article[];

  @OneToMany(() => Comment, (e) => e.user, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  @JoinTable()
  comments: Comment[];
}

@Entity({ name: User.name })
export class User extends Relations {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  readonly id: number;

  @Column({
    type: 'varchar',
    length: 400,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 25,
  })
  nickname: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date | null;
}
