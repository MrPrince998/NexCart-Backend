import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { Roles } from '@/core/decorators/roles.decorator';
import { CreateInventoryMovementDto, UpdateInventoryDto } from './dto/inventory.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@ApiTags('inventory')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: get inventory items' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin: update inventory item' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Post(':id/movements')
  @ApiOperation({ summary: 'Admin: record inventory movement' })
  addMovement(@Param('id') id: string, @Body() dto: CreateInventoryMovementDto) {
    return this.inventoryService.addMovement(id, dto);
  }

  @Get(':id/movements')
  @ApiOperation({ summary: 'Admin: get inventory movement history' })
  movements(@Param('id') id: string) {
    return this.inventoryService.movements(id);
  }
}
