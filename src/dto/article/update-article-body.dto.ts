import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateArticleBodyDto {
  @IsOptional()
  @IsString()
  @Length(1, 127)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2506)
  content?: string;
}
