import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jane Doe' })
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '+1 555 123 4567' })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123 Market Street' })
  line1!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Apt 4B' })
  line2?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'San Francisco' })
  city!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'CA' })
  state!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '94103' })
  postalCode!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'US' })
  country!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
