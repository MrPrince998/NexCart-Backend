import { DateRangeQueryDto } from '@/common/dto/date-range-query.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from './create-user.dto';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'jane' })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'admin' })
  role?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({ enum: UserStatus })
  status?: UserStatus;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isEmailVerified?: boolean;
}
