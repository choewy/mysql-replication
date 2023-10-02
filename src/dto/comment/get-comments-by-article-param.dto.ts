import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class GetCommentsByArticleParamDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly articleId: number;
}
