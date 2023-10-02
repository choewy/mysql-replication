import { Article } from '@common/entities';

export class ArticleResponseDto extends Article {
  commentCount?: number;
  likeCount?: number;
  hasLike?: boolean;
}
