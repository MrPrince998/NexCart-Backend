import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '@/common/handler/pagination.helper';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async findAll(query: PaginationQueryDto = {}) {
    const queryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.actor', 'actor')
      .orderBy('audit.createdAt', 'DESC');

    return paginate(queryBuilder, query, 'Audit logs retrieved successfully');
  }
}
