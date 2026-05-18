import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @ApiProperty({ example: 'Acme' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Premium consumer electronics.' })
  description?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://acme.example.com' })
  websiteUrl?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class UpdateBrandDto extends CreateBrandDto {}
