import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class GetCommentParamDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;
}
