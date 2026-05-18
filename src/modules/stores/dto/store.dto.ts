import { StoreStatus } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @ApiProperty({ example: 'Acme Store' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Official Acme storefront.' })
  description?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logoUrl?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'support@acme.com' })
  supportEmail?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '+1 555 123 4567' })
  supportPhone?: string;
}

export class UpdateStoreDto extends CreateStoreDto {
  @IsOptional()
  @IsEnum(StoreStatus)
  @ApiPropertyOptional({ enum: StoreStatus })
  status?: StoreStatus;
}
