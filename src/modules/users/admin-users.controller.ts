import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ConflictResponse,
  ForbiddenResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from '@/common/schemas/error.response';
import { Role } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('admin/users')
@ApiTags('users')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiForbiddenResponse({ type: ForbiddenResponse })
@Roles(Role.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Admin: create user' })
  @ApiOkResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ type: ConflictResponse })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: get paginated users' })
  @ApiOkResponse({ description: 'Users retrieved successfully' })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: get user by id' })
  @ApiOkResponse({ description: 'User retrieved successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update user' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: update user status' })
  @ApiOkResponse({ description: 'User status updated successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.usersService.updateUserStatus(id, dto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Admin: update user role' })
  @ApiOkResponse({ description: 'User role updated successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateUserRole(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: delete user' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
