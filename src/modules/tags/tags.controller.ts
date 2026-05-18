import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
@ApiTags('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all product tags' })
  findAll() {
    return this.tagsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: create product tag' })
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: update product tag' })
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: delete product tag' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
