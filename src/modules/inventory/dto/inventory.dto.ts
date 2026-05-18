import { InventoryMovementType } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateInventoryDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 50 })
  quantity!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 5 })
  lowStockThreshold?: number;
}

export class CreateInventoryMovementDto {
  @IsEnum(InventoryMovementType)
  @ApiProperty({ enum: InventoryMovementType })
  type!: InventoryMovementType;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 10 })
  quantity!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'manual_adjustment' })
  referenceType?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '5e09d148-70ef-417d-9750-04eb97e1b9e8' })
  referenceId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Cycle count correction' })
  note?: string;
}
