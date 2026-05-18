import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository, SelectQueryBuilder, In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { generateSku } from '@/common/utils/sku.util';
import { paginate } from '@/common/handler/pagination.helper';
import { ProductStatus, ImageEntity } from '@/common/enums';
import {
  emptyReponse,
  successResponse,
} from '@/common/handler/response.helper';
import { ProductQueryDto } from './dto/product-query.dto';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { Image } from '@/modules/images/entities/image.entity';
import {
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductDeletedEvent,
  ProductStatusChangedEvent,
  ProductFeaturedEvent,
  ProductSellerStatusChangedEvent,
  WishlistPriceDropEvent,
  BackInStockEvent,
} from '@/common/events';
import { WishlistItem } from '@/modules/wishlist/entities/wishlist-item.entity';
import { User } from '@/modules/users/entities/user.entity';

const PRODUCT_SORT_COLUMNS = {
  createdAt: 'product.createdAt',
  updatedAt: 'product.updatedAt',
  name: 'product.name',
} as const;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateProductDto) {
    const slug = await generateSlug(dto.name, this.productRepository);
    const sku = generateSku(dto.brand, dto.name);

    const activateImage = await this.cloudinaryService.activateImages(
      dto.images.map((img) => img.publicId),
    );

    const product = await this.dataSource.transaction(async (manager) => {
      const newProduct = manager.create(Product, {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        discountPrice: dto.discountPrice,
        brand: dto.brand,
        status: dto.status,
        categoryId: dto.categoryId,
        isFeatured: dto.isFeatured,
        slug,
        sku,
      });

      const savedProduct = await manager.save(newProduct);

      const imageEntities = activateImage.map(({ publicId, url }, index) => ({
        entityId: savedProduct.id,
        entityType: ImageEntity.PRODUCT,
        url,
        publicId,
        altText: dto.images[index].altText || undefined,
        position: index,
        isPrimary: index === 0,
      }));

      if (imageEntities.length) {
        await manager.insert(Image, imageEntities);
      }

      return savedProduct;
    });

    // Fetch product with relations and attach images
    const productWithRelations = await this.productRepository.findOne({
      where: { id: product.id },
      relations: { category: true },
    });

    if (!productWithRelations) throw new NotFoundException('Product not found');

    await this.attachImages([productWithRelations]);

    // Emit product created event
    this.eventEmitter.emit(
      'product.created',
      new ProductCreatedEvent(
        productWithRelations.id,
        productWithRelations.name,
        productWithRelations.sku,
        productWithRelations.categoryId,
        Number(productWithRelations.price),
        productWithRelations.createdAt,
      ),
    );

    return successResponse(
      productWithRelations,
      'Product created successfully',
    );
  }

  async findAll(pagination: ProductQueryDto = {}) {
    const queryBuilder = this.buildProductQuery();
    this.applySearchFilters(queryBuilder, pagination);
    this.applySorting(queryBuilder, pagination);

    const result = await paginate(
      queryBuilder,
      pagination,
      'Products retrieved successfully',
    );

    // Attach images to products
    if (result.data && Array.isArray(result.data)) {
      await this.attachImages(result.data);
    }

    return result;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    await this.attachImages([product]);

    return successResponse(product, 'Product retrieved successfully');
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException('Product not found');

    // Capture old values for event emission
    const oldStatus = product.status;
    const oldFeatured = product.isFeatured;
    const oldPrice = this.getEffectivePrice(product);
    const oldStock = product.stock;

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      product.slug = await generateSlug(
        updateProductDto.name,
        this.productRepository,
      );
    }

    if (
      (updateProductDto.name && updateProductDto.name !== product.name) ||
      (updateProductDto.brand && updateProductDto.brand !== product.brand)
    ) {
      product.sku = generateSku(
        updateProductDto.brand ?? product.brand,
        updateProductDto.name ?? product.name,
      );
    }

    Object.assign(product, updateProductDto);

    const updatedProduct = await this.productRepository.save(product);
    const newPrice = this.getEffectivePrice(updatedProduct);

    if (newPrice < oldPrice) {
      await this.emitWishlistPriceDrop(updatedProduct, oldPrice, newPrice);
    }

    if (oldStock <= 0 && updatedProduct.stock > 0) {
      await this.emitBackInStock(updatedProduct);
    }

    // Emit product updated event
    this.eventEmitter.emit(
      'product.updated',
      new ProductUpdatedEvent(
        updatedProduct.id,
        updatedProduct.name,
        updatedProduct.sku,
        updatedProduct.categoryId,
        Number(updatedProduct.price),
        updatedProduct.updatedAt,
      ),
    );

    // Emit status changed event if status changed
    if (oldStatus !== updatedProduct.status) {
      this.eventEmitter.emit(
        'product.status.changed',
        new ProductStatusChangedEvent(
          updatedProduct.id,
          updatedProduct.name,
          updatedProduct.status,
        ),
      );

      await this.emitProductSellerStatusChanged(updatedProduct.id);
    }

    // Emit featured changed event if featured status changed
    if (oldFeatured !== updatedProduct.isFeatured) {
      this.eventEmitter.emit(
        'product.featured',
        new ProductFeaturedEvent(
          updatedProduct.id,
          updatedProduct.name,
          updatedProduct.isFeatured,
        ),
      );
    }

    return successResponse(updatedProduct, 'Product updated successfully');
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException('Product not found');

    const result = await this.productRepository.softDelete(id);

    if (!result.affected) throw new NotFoundException('Product not found');

    // Emit product deleted event
    this.eventEmitter.emit(
      'product.deleted',
      new ProductDeletedEvent(
        product.id,
        product.name,
        product.sku,
        new Date(),
      ),
    );

    return emptyReponse('Product deleted successfully');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private Helper Methods - Search & Filter
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Build base query with category join
   */
  private buildProductQuery(): SelectQueryBuilder<Product> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.deletedAt IS NULL');
  }

  private async emitProductSellerStatusChanged(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { store: { owner: true } },
    });

    if (!product?.store?.owner) return;

    this.eventEmitter.emit(
      'product.seller.status.changed',
      new ProductSellerStatusChangedEvent(
        product.id,
        product.name,
        product.status,
        product.store.owner.email,
        product.store.owner.name,
      ),
    );
  }

  private getEffectivePrice(product: Pick<Product, 'price' | 'discountPrice'>) {
    return Number(product.discountPrice ?? product.price);
  }

  private async emitWishlistPriceDrop(
    product: Product,
    oldPrice: number,
    newPrice: number,
  ) {
    const wishlistItems = await this.dataSource
      .getRepository(WishlistItem)
      .find({ where: { productId: product.id } });
    const userIds = [...new Set(wishlistItems.map((item) => item.userId))];
    if (!userIds.length) return;

    const users = await this.dataSource.getRepository(User).find({
      where: { id: In(userIds) },
    });

    for (const user of users) {
      if (
        !user.emailNotificationsEnabled ||
        !user.wishlistEmailNotificationsEnabled
      ) {
        continue;
      }

      this.eventEmitter.emit(
        'wishlist.price_drop',
        new WishlistPriceDropEvent(
          product.id,
          product.name,
          oldPrice,
          newPrice,
          user.email,
          user.name,
        ),
      );
    }
  }

  private async emitBackInStock(product: Product) {
    const wishlistItems = await this.dataSource
      .getRepository(WishlistItem)
      .find({ where: { productId: product.id } });
    const userIds = [...new Set(wishlistItems.map((item) => item.userId))];
    if (!userIds.length) return;

    const users = await this.dataSource.getRepository(User).find({
      where: { id: In(userIds) },
    });

    for (const user of users) {
      if (
        !user.emailNotificationsEnabled ||
        !user.wishlistEmailNotificationsEnabled
      ) {
        continue;
      }

      this.eventEmitter.emit(
        'wishlist.back_in_stock',
        new BackInStockEvent(product.id, product.name, user.email, user.name),
      );
    }
  }

  /**
   * Apply pg_trgm fuzzy search with word_similarity on product name
   * Threshold: 0.15 (matches ~15% similarity)
   */
  private applyTextSearch(
    queryBuilder: SelectQueryBuilder<Product>,
    searchTerm: string,
  ): void {
    queryBuilder.addSelect(
      `word_similarity(:search, product.name)`,
      'similarity',
    );

    queryBuilder.andWhere(
      `word_similarity(:search, product.name) > :threshold`,
      { search: searchTerm, threshold: 0.15 },
    );
  }

  /**
   * Apply all filters (search, category, brand, status)
   */
  private applySearchFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    pagination: ProductQueryDto,
  ): void {
    // Text search - fuzzy matching
    if (pagination.q) {
      this.applyTextSearch(queryBuilder, pagination.q);
    }

    // Category filter
    if (pagination.category) {
      queryBuilder.andWhere(
        '(product.categoryId = :category OR category.slug = :category)',
        { category: pagination.category },
      );
    }

    // Brand filter
    if (pagination.brand) {
      queryBuilder.andWhere('product.brand ILIKE :brand', {
        brand: `%${pagination.brand}%`,
      });
    }

    // Status filter (default to ACTIVE)
    queryBuilder.andWhere('product.status = :status', {
      status: pagination.status ?? ProductStatus.ACTIVE,
    });
  }

  /**
   * Apply sorting - use similarity score if searching, otherwise use standard columns
   */
  private applySorting(
    queryBuilder: SelectQueryBuilder<Product>,
    pagination: ProductQueryDto,
  ): void {
    // When searching, sort by similarity score first
    if (pagination.q) {
      queryBuilder.orderBy('similarity', 'DESC');
      return;
    }

    // Otherwise use standard sorting
    const sortColumn =
      PRODUCT_SORT_COLUMNS[pagination.sortBy ?? 'createdAt'] ??
      PRODUCT_SORT_COLUMNS.createdAt;

    queryBuilder.orderBy(sortColumn, pagination.sortOrder ?? 'DESC');
  }

  /**
   * Attach images to products by fetching from polymorphic Image table
   * Groups images by entityId and attaches them to corresponding products
   */
  private async attachImages(products: Product[]): Promise<void> {
    if (!products.length) return;

    const productIds = products.map((p) => p.id);

    // Fetch all images for these products in one query
    const allImages = await this.imageRepository
      .createQueryBuilder('img')
      .where('img.entityId IN (:...ids)', { ids: productIds })
      .andWhere('img.entityType = :entityType', {
        entityType: ImageEntity.PRODUCT,
      })
      .orderBy('img.position', 'ASC')
      .getMany();

    // Group images by entityId
    const imagesByEntity = new Map<string, Image[]>();
    allImages.forEach((img) => {
      if (!imagesByEntity.has(img.entityId)) {
        imagesByEntity.set(img.entityId, []);
      }
      imagesByEntity.get(img.entityId)!.push(img);
    });

    // Attach images to products
    products.forEach((product) => {
      const productImages = imagesByEntity.get(product.id) || [];
      (product as any).images = productImages;
      (product as any).primaryImage =
        productImages.find((img) => img.isPrimary) || productImages[0] || null;
    });
  }
}
