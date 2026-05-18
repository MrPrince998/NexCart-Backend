import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateStripeCheckoutSessionDto {
  @IsUUID()
  @ApiProperty({ example: '5e09d148-70ef-417d-9750-04eb97e1b9e8' })
  orderId!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @ApiPropertyOptional({ example: 'http://localhost:3000/checkout/success' })
  successUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @ApiPropertyOptional({ example: 'http://localhost:3000/checkout/cancel' })
  cancelUrl?: string;
}
