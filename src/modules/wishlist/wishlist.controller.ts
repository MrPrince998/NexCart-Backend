import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
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
} from '@/common/schemas/error.response';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import {
  EmptySuccessResponseDto,
  WishlistResponseDto,
} from '@/common/schemas/commerce.response';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@ApiTags('wishlist')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  @ApiOkResponse({
    type: WishlistResponseDto,
    description: 'Wishlist retrieved successfully',
  })
  findAll(@CurrentUser('id') userId: string) {
    return this.wishlistService.findAll(userId);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add a product to the wishlist' })
  @ApiParam({
    name: 'productId',
    description: 'Product UUID',
    example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b',
  })
  @ApiOkResponse({
    type: WishlistResponseDto,
    description: 'Product added to wishlist',
  })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  add(@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.add(userId, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @ApiParam({
    name: 'productId',
    description: 'Product UUID',
    example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b',
  })
  @ApiOkResponse({
    type: EmptySuccessResponseDto,
    description: 'Product removed from wishlist',
  })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  remove(@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.remove(userId, productId);
  }
}
