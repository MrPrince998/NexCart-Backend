import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateUserRoleDto {
  @IsUUID()
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  roleId!: string;
}
