import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import {
  CreateProductAttributeDto,
  SetProductAttributeValueDto,
  UpdateProductAttributeDto,
} from './dto/product-attribute.dto';
import { ProductAttributesService } from './product-attributes.service';

@Controller('product-attributes')
@ApiTags('product-attributes')
export class ProductAttributesController {
  constructor(private readonly attributesService: ProductAttributesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get product attributes' })
  @ApiQuery({ name: 'categoryId', required: false })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.attributesService.findAll(categoryId);
  }

  @Get('products/:productId/values')
  @Public()
  @ApiOperation({ summary: 'Get attribute values for a product' })
  values(@Param('productId') productId: string) {
    return this.attributesService.values(productId);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: create product attribute' })
  create(@Body() dto: CreateProductAttributeDto) {
    return this.attributesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: update product attribute' })
  update(@Param('id') id: string, @Body() dto: UpdateProductAttributeDto) {
    return this.attributesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: delete product attribute' })
  remove(@Param('id') id: string) {
    return this.attributesService.remove(id);
  }

  @Post('values')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: set product attribute value' })
  setValue(@Body() dto: SetProductAttributeValueDto) {
    return this.attributesService.setValue(dto);
  }
}
