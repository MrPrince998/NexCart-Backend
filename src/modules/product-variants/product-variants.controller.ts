import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { CreateProductVariantDto, UpdateProductVariantDto } from './dto/product-variant.dto';
import { ProductVariantsService } from './product-variants.service';

@Controller('product-variants')
@ApiTags('product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Get active variants for a product' })
  findByProduct(@Param('productId') productId: string) {
    return this.variantsService.findByProduct(productId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: get all product variants' })
  findAll() {
    return this.variantsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: create product variant' })
  create(@Body() dto: CreateProductVariantDto) {
    return this.variantsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: update product variant' })
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: delete product variant' })
  remove(@Param('id') id: string) {
    return this.variantsService.remove(id);
  }
}
