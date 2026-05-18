import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended',
}

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @IsEmail()
  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '+1 555 123 4567' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  image?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  roleId?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE })
  status?: UserStatus;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isEmailVerified?: boolean;
}
