import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Controller('coupons')
@ApiTags('coupons')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: get all coupons' })
  findAll() {
    return this.couponsService.findAll();
  }

  @Get('redemptions')
  @ApiOperation({ summary: 'Admin: get coupon redemptions' })
  @ApiQuery({ name: 'couponId', required: false })
  redemptions(@Query('couponId') couponId?: string) {
    return this.couponsService.redemptions(couponId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Admin: get one coupon' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: create coupon' })
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update coupon' })
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: delete coupon' })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
