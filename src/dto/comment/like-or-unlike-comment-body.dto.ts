import { IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class LikeOrUnLikeCommentBodyDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly like: boolean;
}
