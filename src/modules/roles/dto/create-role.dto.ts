import { Permission } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ example: 'manager' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'Store manager role' })
  description!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isSystem?: boolean;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ enum: Permission, isArray: true })
  permissions?: Permission[];
}
