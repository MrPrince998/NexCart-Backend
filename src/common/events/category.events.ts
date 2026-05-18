/**
 * Domain Events for ProductCategory entity
 * These events are emitted when category operations occur
 */

export class ProductCategoryCreatedEvent {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public parentCategoryId: string | null,
    public createdAt: Date = new Date(),
  ) {}
}

export class ProductCategoryUpdatedEvent {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public parentCategoryId: string | null,
    public updatedAt: Date = new Date(),
  ) {}
}

export class ProductCategoryDeletedEvent {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public deletedAt: Date = new Date(),
  ) {}
}

export class ProductCategoryStatusChangedEvent {
  constructor(
    public id: string,
    public name: string,
    public isActive: boolean,
    public timestamp: Date = new Date(),
  ) {}
}
