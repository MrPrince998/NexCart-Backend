import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from './create-user.dto';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @ApiProperty({ enum: UserStatus, example: UserStatus.BLOCKED })
  status!: UserStatus;
}
