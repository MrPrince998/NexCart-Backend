import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Gaming' })
  name!: string;
}

export class UpdateTagDto extends CreateTagDto {}
