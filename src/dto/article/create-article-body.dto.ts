import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateArticleBodyDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 127)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 2506)
  content: string;
}
