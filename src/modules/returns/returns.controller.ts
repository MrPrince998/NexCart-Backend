import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import {
  CreateRefundDto,
  CreateReturnRequestDto,
  UpdateRefundStatusDto,
  UpdateReturnStatusDto,
} from './dto/return.dto';
import { ReturnsService } from './returns.service';

@Controller('returns')
@ApiTags('returns')
@ApiBearerAuth('access-token')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get('mine')
  @ApiOperation({ summary: 'Get current user return requests' })
  mine(@CurrentUser('id') userId: string) {
    return this.returnsService.mine(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create return request' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReturnRequestDto) {
    return this.returnsService.create(userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: get all return requests' })
  findAll() {
    return this.returnsService.findAll();
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: update return request status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReturnStatusDto) {
    return this.returnsService.updateStatus(id, dto);
  }

  @Post(':id/refunds')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: create refund for return request' })
  createRefund(@Param('id') id: string, @Body() dto: CreateRefundDto) {
    return this.returnsService.createRefund(id, dto);
  }

  @Patch('refunds/:id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: update refund status' })
  updateRefund(@Param('id') id: string, @Body() dto: UpdateRefundStatusDto) {
    return this.returnsService.updateRefund(id, dto);
  }
}
