import { DateRangeQueryDto } from '@/common/dto/date-range-query.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
