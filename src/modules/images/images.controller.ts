import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageEntity, Role } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';
import { ImagesService } from './images.service';

@Controller('images')
@ApiTags('images')
@ApiBearerAuth('access-token')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get images for an entity' })
  findByEntity(
    @Param('entityType') entityType: ImageEntity,
    @Param('entityId') entityId: string,
  ) {
    return this.imagesService.findByEntity(entityType, entityId);
  }

  @Delete(':entityType/:entityId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: delete all images for an entity' })
  async deleteAllForEntity(
    @Param('entityType') entityType: ImageEntity,
    @Param('entityId') entityId: string,
  ) {
    await this.imagesService.deleteAllForEntity(entityType, entityId);
    return { success: true, message: 'Images deleted successfully' };
  }
}
