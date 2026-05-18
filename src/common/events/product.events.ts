/**
 * Domain Events for Product entity
 * These events are emitted when product operations occur
 */

export class ProductCreatedEvent {
  constructor(
    public id: string,
    public name: string,
    public sku: string,
    public categoryId: string,
    public price: number,
    public createdAt: Date = new Date(),
  ) {}
}

export class ProductUpdatedEvent {
  constructor(
    public id: string,
    public name: string,
    public sku: string,
    public categoryId: string,
    public price: number,
    public updatedAt: Date = new Date(),
  ) {}
}

export class ProductDeletedEvent {
  constructor(
    public id: string,
    public name: string,
    public sku: string,
    public deletedAt: Date = new Date(),
  ) {}
}

export class ProductFeaturedEvent {
  constructor(
    public id: string,
    public name: string,
    public isFeatured: boolean,
    public timestamp: Date = new Date(),
  ) {}
}

export class ProductStatusChangedEvent {
  constructor(
    public id: string,
    public name: string,
    public status: string,
    public timestamp: Date = new Date(),
  ) {}
}
