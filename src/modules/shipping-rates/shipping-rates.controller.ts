import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';
import {
  CalculateShippingRatesDto,
  CreateShippingRateDto,
  CreateShippingZoneDto,
  UpdateShippingRateDto,
  UpdateShippingZoneDto,
} from './dto/shipping-rate.dto';
import { ShippingRatesService } from './shipping-rates.service';

@Controller('shipping-rates')
@ApiTags('shipping-rates')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
export class ShippingRatesController {
  constructor(private readonly shippingRatesService: ShippingRatesService) {}

  @Get('zones')
  @ApiOperation({ summary: 'Admin: get shipping zones' })
  zones() {
    return this.shippingRatesService.zones();
  }

  @Post('zones')
  @ApiOperation({ summary: 'Admin: create shipping zone' })
  createZone(@Body() dto: CreateShippingZoneDto) {
    return this.shippingRatesService.createZone(dto);
  }

  @Patch('zones/:id')
  @ApiOperation({ summary: 'Admin: update shipping zone' })
  updateZone(@Param('id') id: string, @Body() dto: UpdateShippingZoneDto) {
    return this.shippingRatesService.updateZone(id, dto);
  }

  @Delete('zones/:id')
  @ApiOperation({ summary: 'Admin: delete shipping zone' })
  deleteZone(@Param('id') id: string) {
    return this.shippingRatesService.deleteZone(id);
  }

  @Get()
  @ApiOperation({ summary: 'Admin: get shipping rates' })
  @ApiQuery({ name: 'zoneId', required: false })
  rates(@Query('zoneId') zoneId?: string) {
    return this.shippingRatesService.rates(zoneId);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Admin: calculate applicable shipping rates' })
  calculate(@Body() dto: CalculateShippingRatesDto) {
    return this.shippingRatesService.calculate(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Admin: create shipping rate' })
  createRate(@Body() dto: CreateShippingRateDto) {
    return this.shippingRatesService.createRate(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update shipping rate' })
  updateRate(@Param('id') id: string, @Body() dto: UpdateShippingRateDto) {
    return this.shippingRatesService.updateRate(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Admin: delete shipping rate' })
  deleteRate(@Param('id') id: string) {
    return this.shippingRatesService.deleteRate(id);
  }
}
