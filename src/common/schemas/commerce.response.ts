import { OrderStatus, PaymentMethod, PaymentStatus } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartProductSummaryDto {
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  id!: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  name!: string;

  @ApiProperty({ example: 'wireless-headphones' })
  slug!: string;

  @ApiProperty({ example: 'NC-WIR-ABC123' })
  sku!: string;

  @ApiProperty({ example: 199.99 })
  price!: number;

  @ApiPropertyOptional({ example: 149.99, nullable: true })
  discountPrice!: number | null;
}

export class CartItemResponseDto {
  @ApiProperty({ example: '7b8f9c1a-5538-4a72-8d0e-6df2c66cb6d7' })
  id!: string;

  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId!: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  variantId!: string | null;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ type: () => CartProductSummaryDto })
  product!: CartProductSummaryDto;
}

export class CartSummaryDto {
  @ApiProperty({ type: () => [CartItemResponseDto] })
  items!: CartItemResponseDto[];

  @ApiProperty({ example: 2 })
  itemCount!: number;

  @ApiProperty({ example: 299.98 })
  subtotal!: number;
}

export class CartResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Cart retrieved successfully' })
  message!: string;

  @ApiProperty({ type: () => CartSummaryDto })
  data!: CartSummaryDto;

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}

export class EmptySuccessResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Operation completed successfully' })
  message!: string;

  @ApiProperty({ type: 'null', example: null, nullable: true })
  data!: null;

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}

export class WishlistItemResponseDto {
  @ApiProperty({ example: '3efda86e-0fd5-4e6f-a07c-3c8b8aa2a5a6' })
  id!: string;

  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId!: string;

  @ApiProperty({ type: () => CartProductSummaryDto })
  product!: CartProductSummaryDto;
}

export class WishlistResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Wishlist retrieved successfully' })
  message!: string;

  @ApiProperty({ type: () => [WishlistItemResponseDto] })
  data!: WishlistItemResponseDto[];

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}

export class OrderItemResponseDto {
  @ApiProperty({ example: '0f079b16-e372-49d1-b517-8d15a327881f' })
  id!: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  productName!: string;

  @ApiProperty({ example: 'NC-WIR-ABC123' })
  sku!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: 149.99 })
  unitPrice!: number;

  @ApiProperty({ example: 299.98 })
  lineTotal!: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '5e09d148-70ef-417d-9750-04eb97e1b9e8' })
  id!: string;

  @ApiProperty({ example: 'NC-1778945400000-A1B2C3' })
  orderNumber!: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status!: OrderStatus;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH_ON_DELIVERY })
  paymentMethod!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  @ApiProperty({ example: 299.98 })
  subtotal!: number;

  @ApiProperty({ example: 299.98 })
  total!: number;

  @ApiProperty({ type: () => [OrderItemResponseDto] })
  items!: OrderItemResponseDto[];
}

export class OrderDetailResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Order retrieved successfully' })
  message!: string;

  @ApiProperty({ type: () => OrderResponseDto })
  data!: OrderResponseDto;

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}

export class OrderListResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Orders retrieved successfully' })
  message!: string;

  @ApiProperty({ type: () => [OrderResponseDto] })
  data!: OrderResponseDto[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 25,
      pages: 3,
      nextPage: true,
      prevPage: false,
    },
  })
  pagination!: Record<string, number | boolean>;

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}

export class DashboardAnalyticsResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Dashboard analytics retrieved successfully' })
  message!: string;

  @ApiProperty({
    example: {
      totals: {
        orders: 42,
        products: 120,
        activeProducts: 100,
        users: 500,
        revenue: 12999.95,
      },
      topProducts: [],
      recentOrders: [],
    },
  })
  data!: Record<string, unknown>;

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}

export class SalesSummaryResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Sales summary retrieved successfully' })
  message!: string;

  @ApiProperty({
    example: {
      orderCount: 42,
      revenue: 12999.95,
      averageOrderValue: 309.52,
    },
  })
  data!: Record<string, number>;

  @ApiProperty({ example: '2026-05-16T15:31:00.000Z' })
  timestamp!: string;
}
