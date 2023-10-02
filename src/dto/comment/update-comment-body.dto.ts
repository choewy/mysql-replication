import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class UpdateCommentBodyDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 512)
  readonly comment: string;
}
