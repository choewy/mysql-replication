import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class GetArticleParamDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;
}
