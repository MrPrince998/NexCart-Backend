import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Controller('brands')
@ApiTags('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get active brands' })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':idOrSlug')
  @Public()
  @ApiOperation({ summary: 'Get brand by id or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.brandsService.findOne(idOrSlug);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: create brand' })
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: update brand' })
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: delete brand' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
