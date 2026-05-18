import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Roles } from '@/core/decorators/roles.decorator';
import { AuditService } from './audit.service';

@Controller('audit-logs')
@ApiTags('audit-logs')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Admin: get audit logs' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.auditService.findAll(query);
  }
}
