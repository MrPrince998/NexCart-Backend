import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class DateRangeQueryDto {
  @IsOptional()
  @Type(() => Date)
  createdFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  createdTo?: Date;
}
