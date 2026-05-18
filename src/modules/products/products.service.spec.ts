import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from '@/modules/images/entities/image.entity';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ProductsService', () => {
  let service: ProductsService;
  const productRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
        {
          provide: getRepositoryToken(Image),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            activateImages: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
