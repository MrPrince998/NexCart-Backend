import { RefundStatus, ReturnStatus } from '@/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateReturnRequestDto {
  @IsUUID()
  @ApiProperty({ example: '5e09d148-70ef-417d-9750-04eb97e1b9e8' })
  orderId!: string;

  @IsUUID()
  @ApiProperty({ example: '0f079b16-e372-49d1-b517-8d15a327881f' })
  orderItemId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 })
  quantity!: number;

  @IsString()
  @ApiProperty({ example: 'Wrong size' })
  reason!: string;
}

export class UpdateReturnStatusDto {
  @IsEnum(ReturnStatus)
  @ApiProperty({ enum: ReturnStatus })
  status!: ReturnStatus;
}

export class CreateRefundDto {
  @IsUUID()
  @ApiProperty({ example: 'a83fd413-9d6d-4c85-9460-89ff2f42aa16' })
  paymentId!: string;

  @Type(() => Number)
  @ApiProperty({ example: 99.99 })
  amount!: number;

  @IsString()
  @ApiProperty({ example: 'USD' })
  currency!: string;
}

export class UpdateRefundStatusDto {
  @IsEnum(RefundStatus)
  @ApiProperty({ enum: RefundStatus })
  status!: RefundStatus;
}
