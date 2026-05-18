import {
  Repository,
  FindManyOptions,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponse } from '../schemas/success.response';

export async function paginate<T extends ObjectLiteral>(
  source: Repository<T> | SelectQueryBuilder<T>,
  pagination: PaginationQueryDto,
  message: string = 'Data retrieved successfully',
  options?: FindManyOptions<T>,
): Promise<PaginatedResponse<T>> {
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 10;
  const skip = (page - 1) * limit;

  let data: T[];
  let total: number;

  if (source instanceof SelectQueryBuilder) {
    // Clone query builder to get total count before pagination
    const countQuery = source.clone();
    total = await countQuery.getCount();

    // Apply pagination to the original query
    data = await source.skip(skip).take(limit).getMany();
  } else {
    // For repository, use findAndCount directly
    [data, total] = await source.findAndCount({
      ...options,
      skip,
      take: limit,
    });
  }

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    statusCode: 200,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: totalPages,
      nextPage: page < totalPages,
      prevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
}
