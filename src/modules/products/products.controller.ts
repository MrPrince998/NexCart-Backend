import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  SuccessObjectResponse,
  PaginatedResponse,
  SuccessEmptyResponse,
} from '@/common/schemas/success.response';
import {
  ValidationErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
} from '@/common/schemas/error.response';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({ type: SuccessObjectResponse, description: 'Product created successfully' })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of products' })
  @ApiOkResponse({ type: PaginatedResponse, description: 'Products retrieved successfully' })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiOkResponse({ type: SuccessObjectResponse, description: 'Product retrieved successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiOkResponse({ type: SuccessObjectResponse, description: 'Product updated successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiOkResponse({ type: SuccessEmptyResponse, description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
