import { OrderStatus, PaymentStatus } from '@/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({ enum: OrderStatus })
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  @ApiPropertyOptional({ enum: PaymentStatus })
  paymentStatus?: PaymentStatus;
}
