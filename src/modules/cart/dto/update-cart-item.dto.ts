import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 2, minimum: 1 })
  quantity!: number;
}
