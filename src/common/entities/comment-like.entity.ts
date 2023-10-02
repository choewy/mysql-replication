import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';
import { Comment } from './comment.entity';

class Relations {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Comment, (e) => e.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comment: Comment;
}

@Entity({ name: CommentLike.name })
export class CommentLike extends Relations {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
  })
  readonly userId: number;

  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
  })
  readonly commentId: number;

  @CreateDateColumn()
  readonly likedAt: Date;
}
