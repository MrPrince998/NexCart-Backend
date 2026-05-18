import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
@ApiTags('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get stores' })
  findAll() {
    return this.storesService.findAll();
  }

  @Get('mine')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current seller stores' })
  mine(@CurrentUser('id') userId: string) {
    return this.storesService.mine(userId);
  }

  @Get('dashboard')
  @ApiBearerAuth('access-token')
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Seller dashboard summary' })
  dashboard(@CurrentUser('id') userId: string) {
    return this.storesService.dashboard(userId);
  }

  @Get(':idOrSlug')
  @Public()
  @ApiOperation({ summary: 'Get store by id or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.storesService.findOne(idOrSlug);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create seller store' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return this.storesService.create(userId, dto);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: update store' })
  update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: delete store' })
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
