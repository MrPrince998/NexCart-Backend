import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from '@/common/schemas/error.response';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Profile retrieved successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user profile' })
  @ApiOkResponse({ description: 'Profile deleted successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  deleteProfile(@CurrentUser('id') userId: string) {
    return this.usersService.deleteProfile(userId);
  }
}
