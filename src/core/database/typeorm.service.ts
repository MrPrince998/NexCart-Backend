import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * TypeORM Service for database operations
 */
@Injectable()
export class TypeOrmService {
  constructor(private dataSource: DataSource) {}

  /**
   * Get the DataSource instance
   */
  getDataSource(): DataSource {
    return this.dataSource;
  }

  /**
   * Check if database connection is alive
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Run database migrations
   */
  async runMigrations(): Promise<void> {
    try {
      await this.dataSource.runMigrations();
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    }
  }

  /**
   * Revert last migration
   */
  async revertMigration(): Promise<void> {
    try {
      await this.dataSource.undoLastMigration();
    } catch (error) {
      console.error('Error reverting migration:', error);
      throw error;
    }
  }
}
