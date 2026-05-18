/**
 * Domain Events for User entity
 * These events are emitted when user operations occur
 */

export class UserCreatedEvent {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public roleId: string,
    public createdAt: Date = new Date(),
  ) {}
}

export class UserUpdatedEvent {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public roleId: string,
    public updatedAt: Date = new Date(),
  ) {}
}

export class UserDeletedEvent {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public deletedAt: Date = new Date(),
  ) {}
}

export class UserEmailVerifiedEvent {
  constructor(
    public id: string,
    public email: string,
    public verifiedAt: Date = new Date(),
  ) {}
}

export class UserStatusChangedEvent {
  constructor(
    public id: string,
    public email: string,
    public status: 'active' | 'blocked' | 'suspended',
    public timestamp: Date = new Date(),
  ) {}
}

export class UserBecameSellerEvent {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public timestamp: Date = new Date(),
  ) {}
}

export class UserSecurityEmailEvent {
  constructor(
    public email: string,
    public name: string,
    public subject: string,
    public title: string,
    public message: string,
    public timestamp: Date = new Date(),
  ) {}
}
