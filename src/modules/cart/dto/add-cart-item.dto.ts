import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId!: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, minimum: 1 })
  quantity!: number;
}
