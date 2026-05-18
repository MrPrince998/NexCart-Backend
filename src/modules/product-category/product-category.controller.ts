import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { NotFoundResponse } from '@/common/schemas/error.response';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryService } from './product-category.service';

@Controller('product-category')
@ApiTags('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: create product category' })
  create(@Body() dto: CreateProductCategoryDto) {
    return this.productCategoryService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get paginated product categories' })
  @ApiOkResponse({ description: 'Categories retrieved successfully' })
  findAll(@Query() query: ProductCategoryQueryDto) {
    return this.productCategoryService.findAll(query);
  }

  @Get('tree')
  @Public()
  @ApiOperation({ summary: 'Get active category tree' })
  findTree() {
    return this.productCategoryService.findTree();
  }

  @Get(':idOrSlug')
  @Public()
  @ApiOperation({ summary: 'Get product category by id or slug' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productCategoryService.findOne(idOrSlug);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: update product category' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  update(@Param('id') id: string, @Body() dto: UpdateProductCategoryDto) {
    return this.productCategoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Admin: delete product category',
    description:
      'Soft deletes a category and reassigns its products to the uncategorized category.',
  })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  remove(@Param('id') id: string) {
    return this.productCategoryService.softDeleteCategory(id);
  }
}
