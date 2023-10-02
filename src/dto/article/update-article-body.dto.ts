import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateArticleBodyDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;

  @IsOptional()
  @IsString()
  @Length(1, 127)
  readonly title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2506)
  readonly content?: string;
}
