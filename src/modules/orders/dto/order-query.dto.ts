import { OrderStatus, PaymentStatus } from '@/common/enums';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

export class OrderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({ enum: OrderStatus })
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  @ApiPropertyOptional({ enum: PaymentStatus })
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsIn(['createdAt', 'total'])
  @ApiPropertyOptional({ example: 'createdAt' })
  sortBy?: 'createdAt' | 'total';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({ example: 'DESC' })
  sortOrder?: 'ASC' | 'DESC';
}
