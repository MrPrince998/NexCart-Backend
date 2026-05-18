import { PaymentProvider, PaymentStatus } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @ApiProperty({ example: '5e09d148-70ef-417d-9750-04eb97e1b9e8' })
  orderId!: string;

  @IsEnum(PaymentProvider)
  @ApiProperty({ enum: PaymentProvider })
  provider!: PaymentProvider;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 299.98 })
  amount!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'pi_123' })
  providerTransactionId?: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ example: { gateway: 'stripe' } })
  metadata?: Record<string, unknown>;
}

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;
}
