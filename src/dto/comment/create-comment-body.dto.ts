import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateCommentBodyDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly articleId: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 512)
  readonly comment: string;
}
