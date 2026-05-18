import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role as RoleEnum } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';

@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth('access-token')
@Roles(RoleEnum.ADMIN)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Admin: create role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: get roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: get role by id' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update role' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: delete role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
