import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Controller('addresses')
@ApiTags('addresses')
@ApiBearerAuth('access-token')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user addresses' })
  findMine(@CurrentUser('id') userId: string) {
    return this.addressesService.findMine(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create current user address' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update current user address' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressesService.update(userId, id, dto);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set current user default address' })
  setDefault(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.addressesService.setDefault(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete current user address' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.addressesService.remove(userId, id);
  }
}
