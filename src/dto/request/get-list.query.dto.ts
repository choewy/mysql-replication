import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetListQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly skip?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly take?: number;
}
