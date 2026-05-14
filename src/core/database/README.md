# Database Module

Professional database configuration and utilities for NexCart using PostgreSQL and TypeORM.

## Directory Structure

```
src/core/database/
├── index.ts                    # Public exports
├── database.module.ts          # NestJS module configuration
├── typeorm.service.ts          # Database utility service
├── base.entity.ts              # Base entity class for all models
└── migrations/                 # Database migration files (auto-generated)
```

## Core Components

### DatabaseModule

Configures TypeORM with PostgreSQL using async configuration from environment variables.

**Features:**

- Auto-loads all entities from `src/**/*.entity.ts`
- Auto-creates tables in development mode
- Connection pooling (20 connections in dev, 50 in production)
- SSL support for production environments
- Intelligent logging based on environment

**Usage:**

```typescript
import { DatabaseModule } from '@/core/database';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
```

### TypeOrmService

Injectable service for common database operations.

**Methods:**

- `getDataSource()` - Get the TypeORM DataSource instance
- `isConnected()` - Check if database connection is alive
- `runMigrations()` - Execute pending migrations
- `revertMigration()` - Undo the last migration

**Usage:**

```typescript
import { TypeOrmService } from '@/core/database';

export class UserService {
  constructor(private db: TypeOrmService) {}

  async checkHealth() {
    const isConnected = await this.db.isConnected();
    console.log(`Database: ${isConnected ? 'online' : 'offline'}`);
  }
}
```

### BaseTimeEntity

Abstract base class for all entities with common timestamp fields.

**Inherits:**

- `id` (UUID) - Primary key
- `createdAt` - Automatic creation timestamp
- `updatedAt` - Automatic update timestamp

**Example:**

```typescript
import { Entity, Column } from 'typeorm';
import { BaseTimeEntity } from '@/core/database';

@Entity('users')
export class User extends BaseTimeEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
```

## Configuration

### Environment Variables

Required:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nexcart_dev
```

Optional:

```env
NODE_ENV=development  # development, staging, production
```

### Database URL Format

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

Examples:

```
postgresql://postgres:password@localhost:5432/nexcart_dev
postgresql://user:pass@db.example.com:5432/nexcart_prod
```

## Creating Entities

1. Create a new entity file in your module folder:

```typescript
// src/modules/users/entities/user.entity.ts
import { Entity, Column, Index } from 'typeorm';
import { BaseTimeEntity } from '@/core/database';

@Entity('users')
@Index(['email'], { unique: true })
export class User extends BaseTimeEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;
}
```

2. Entities are automatically discovered and loaded

3. In development, tables are auto-created

4. For production, generate and run migrations

## Database Migrations

### Generate Migration

After modifying entities, generate a migration:

```bash
npm run migration:generate -- AddUserTable
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

## Environment-Specific Configuration

### Development

- Synchronize: ✅ Enabled
- Logging: Verbose (queries, errors, warnings)
- SSL: Disabled
- Pool: 20 connections
- Migration: Auto-synced

### Staging

- Synchronize: ❌ Disabled (use migrations)
- Logging: Errors and warnings only
- SSL: ✅ Enabled
- Pool: 20 connections

### Production

- Synchronize: ❌ Disabled
- Logging: Errors only
- SSL: ✅ Enabled
- Pool: 50 connections (optimized for scale)

## Best Practices

1. **Always extend BaseTimeEntity**

   ```typescript
   export class User extends BaseTimeEntity {
     // Your properties
   }
   ```

2. **Use proper TypeORM decorators**

   ```typescript
   @Entity('table_name')
   @Index(['field'], { unique: true })
   export class Entity extends BaseTimeEntity {
     @Column({ type: 'varchar', length: 255, unique: true })
     field: string;
   }
   ```

3. **Create migrations for production changes**

   ```bash
   npm run migration:generate -- DescriptiveChangeName
   npm run migration:run
   ```

4. **Use repositories for queries**

   ```typescript
   import { Repository } from 'typeorm';
   import { InjectRepository } from '@nestjs/typeorm';

   export class UserService {
     constructor(
       @InjectRepository(User)
       private userRepo: Repository<User>,
     ) {}
   }
   ```

5. **Validate database health on startup**

   ```typescript
   export class AppService {
     constructor(private db: TypeOrmService) {}

     async onModuleInit() {
       const isConnected = await this.db.isConnected();
       if (!isConnected) {
         throw new Error('Database connection failed');
       }
     }
   }
   ```

## Configuration Files

### ormconfig.ts

TypeORM CLI configuration for migrations. Uses `getDatabaseConfig()` from `src/core/config/database.config.ts`.

### src/core/config/database.config.ts

Centralized database configuration function with environment-specific presets.

### .env.example

Template for environment variables.

## Troubleshooting

### Connection Refused

- Verify PostgreSQL is running
- Check `DATABASE_URL` is correct
- Ensure port 5432 (default) is accessible

### Migration Errors

```bash
# Check migration status
npm run migration:status

# Revert problematic migration
npm run migration:revert
```

### SSL Errors (Production)

Ensure `NODE_ENV=production` and database supports SSL:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NODE_ENV=production
```

## Resources

- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)

## See Also

- [PostgreSQL Setup Guide](../../docs/POSTGRESQL_SETUP.md)
- [Environment Configuration](../config/env.schema.ts)
