import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from '@/common/schemas/error.response';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import {
  CartResponseDto,
  EmptySuccessResponseDto,
} from '@/common/schemas/commerce.response';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
@ApiTags('cart')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user shopping cart' })
  @ApiOkResponse({
    type: CartResponseDto,
    description: 'Cart retrieved successfully',
  })
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the shopping cart' })
  @ApiOkResponse({
    type: CartResponseDto,
    description: 'Item added and cart returned',
  })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  addItem(@CurrentUser('id') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({
    name: 'id',
    description: 'Cart item UUID',
    example: '7b8f9c1a-5538-4a72-8d0e-6df2c66cb6d7',
  })
  @ApiOkResponse({
    type: CartResponseDto,
    description: 'Cart item updated and cart returned',
  })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  updateItem(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove an item from the shopping cart' })
  @ApiParam({
    name: 'id',
    description: 'Cart item UUID',
    example: '7b8f9c1a-5538-4a72-8d0e-6df2c66cb6d7',
  })
  @ApiOkResponse({
    type: EmptySuccessResponseDto,
    description: 'Cart item removed successfully',
  })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  removeItem(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.cartService.removeItem(userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the current user shopping cart' })
  @ApiOkResponse({
    type: EmptySuccessResponseDto,
    description: 'Cart cleared successfully',
  })
  clear(@CurrentUser('id') userId: string) {
    return this.cartService.clear(userId);
  }
}
