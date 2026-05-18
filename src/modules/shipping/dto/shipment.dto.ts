import { ShipmentStatus } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShipmentDto {
  @IsUUID()
  @ApiProperty({ example: '5e09d148-70ef-417d-9750-04eb97e1b9e8' })
  orderId!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'DHL' })
  carrier?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'TRACK123' })
  trackingNumber?: string;
}

export class UpdateShipmentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'DHL' })
  carrier?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'TRACK123' })
  trackingNumber?: string;

  @IsOptional()
  @IsEnum(ShipmentStatus)
  @ApiPropertyOptional({ enum: ShipmentStatus })
  status?: ShipmentStatus;
}
