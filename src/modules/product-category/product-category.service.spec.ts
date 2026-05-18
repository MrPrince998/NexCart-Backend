import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product-category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { Product } from '../products/entities/product.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  const categoryRepository = {
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };
  const productRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: categoryRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
