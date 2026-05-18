import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';
import { CreateShipmentDto, UpdateShipmentDto } from './dto/shipment.dto';
import { ShippingService } from './shipping.service';

@Controller('shipping')
@ApiTags('shipping')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: get shipments' })
  findAll() {
    return this.shippingService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Admin: create shipment' })
  create(@Body() dto: CreateShipmentDto) {
    return this.shippingService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update shipment' })
  update(@Param('id') id: string, @Body() dto: UpdateShipmentDto) {
    return this.shippingService.update(id, dto);
  }
}
