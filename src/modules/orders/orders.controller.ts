import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@/common/enums';
import {
  ForbiddenResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from '@/common/schemas/error.response';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import {
  EmptySuccessResponseDto,
  OrderDetailResponseDto,
  OrderListResponseDto,
} from '@/common/schemas/commerce.response';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({
    summary: 'Checkout current cart',
    description:
      'Creates an order from the authenticated user cart and clears the cart in a transaction.',
  })
  @ApiOkResponse({
    type: OrderDetailResponseDto,
    description: 'Order created successfully',
  })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  checkout(@CurrentUser('id') userId: string, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(userId, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiOkResponse({
    type: OrderListResponseDto,
    description: 'Orders retrieved successfully',
  })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  findMine(@CurrentUser('id') userId: string, @Query() query: OrderQueryDto) {
    return this.ordersService.findMine(userId, query);
  }

  @Get('mine/:id')
  @ApiOperation({ summary: 'Get one current user order' })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: '5e09d148-70ef-417d-9750-04eb97e1b9e8',
  })
  @ApiOkResponse({
    type: OrderDetailResponseDto,
    description: 'Order retrieved successfully',
  })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  findOneMine(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.findOneForUser(userId, id);
  }

  @Delete('mine/:id')
  @ApiOperation({ summary: 'Cancel one current user order' })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: '5e09d148-70ef-417d-9750-04eb97e1b9e8',
  })
  @ApiOkResponse({
    type: EmptySuccessResponseDto,
    description: 'Order cancelled successfully',
  })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  cancelMine(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.cancelMine(userId, id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: get all orders' })
  @ApiOkResponse({
    type: OrderListResponseDto,
    description: 'Orders retrieved successfully',
  })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: get one order' })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: '5e09d148-70ef-417d-9750-04eb97e1b9e8',
  })
  @ApiOkResponse({
    type: OrderDetailResponseDto,
    description: 'Order retrieved successfully',
  })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/status-history')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: get order status history' })
  statusHistory(@Param('id') id: string) {
    return this.ordersService.statusHistory(id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: update order and payment status' })
  @ApiParam({
    name: 'id',
    description: 'Order UUID',
    example: '5e09d148-70ef-417d-9750-04eb97e1b9e8',
  })
  @ApiOkResponse({
    type: OrderDetailResponseDto,
    description: 'Order updated successfully',
  })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiNotFoundResponse({ type: NotFoundResponse })
  @ApiBadRequestResponse({ type: ValidationErrorResponse })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
