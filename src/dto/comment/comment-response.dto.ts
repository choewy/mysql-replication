import { Comment } from '@common/entities';

export class CommentResponseDto extends Comment {
  likeCount?: number;
  hasLike?: boolean;
}
