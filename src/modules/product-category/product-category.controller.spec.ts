import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;
  const productCategoryService = {
    softDeleteCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [
        {
          provide: ProductCategoryService,
          useValue: productCategoryService,
        },
      ],
    }).compile();

    controller = module.get<ProductCategoryController>(ProductCategoryController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
