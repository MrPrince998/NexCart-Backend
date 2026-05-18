import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';
import { CreateStripeCheckoutSessionDto } from './dto/stripe-checkout-session.dto';
import { PaymentsService } from './payments.service';
import type { Request } from 'express';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth('access-token')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: get payments' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: create payment record' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: update payment status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.paymentsService.updateStatus(id, dto);
  }

  @Post('stripe/checkout-session')
  @ApiOperation({ summary: 'Create Stripe Checkout session for an order' })
  createStripeCheckoutSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateStripeCheckoutSessionDto,
  ) {
    return this.paymentsService.createStripeCheckoutSession(userId, dto);
  }

  @Post('stripe/webhook')
  @Public()
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  handleStripeWebhook(
    @Req() request: Request,
    @Headers('stripe-signature') signature?: string,
  ) {
    return this.paymentsService.handleStripeWebhook(signature, request.rawBody);
  }
}
