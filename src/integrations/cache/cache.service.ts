import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Redis } from '@upstash/redis';

/**
 * Cache Service using Redis
 * Provides methods for cache operations with TTL support
 * Works with both local Redis and cloud providers (Railway, Upstash, etc.)
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private redis?: RedisClientType;
  private upstash?: Redis;
  private connected = false;

  // Default TTL: 1 hour
  private readonly DEFAULT_TTL = 3600;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      const redisUrl = process.env.REDIS_URL;
      const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
      const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!redisUrl && upstashUrl && upstashToken) {
        this.upstash = new Redis({
          url: upstashUrl,
          token: upstashToken,
        });
        this.connected = true;
        this.logger.log('Upstash REST cache configured');
        return;
      }

      if (!redisUrl) {
        this.logger.warn('Cache disabled: REDIS_URL is not configured');
        return;
      }

      this.redis = createClient({ url: redisUrl });

      this.redis.on('error', (err) => {
        this.logger.error('Redis client error:', err);
      });

      this.redis.on('connect', () => {
        this.logger.log('✅ Redis cache connected');
        this.connected = true;
      });

      await this.redis.connect();
    } catch (error) {
      this.logger.error('Failed to initialize Redis cache:', error);
      // Cache service will fail gracefully if Redis is unavailable
    }
  }

  /**
   * Set a key-value pair in cache with TTL
   */
  async set<T>(
    key: string,
    value: T,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<void> {
    try {
      if (!this.connected) return;
      if (this.upstash) {
        await this.upstash.set(key, value, { ex: ttl });
      } else {
        await this.redis!.setEx(key, ttl, JSON.stringify(value));
      }
      this.logger.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache SET error for key ${key}:`, error);
      // Don't throw - cache failures shouldn't break the app
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.connected) return null;
      if (this.upstash) {
        const value = await this.upstash.get<T>(key);
        if (value) {
          this.logger.debug(`Cache HIT: ${key}`);
          return value;
        }

        this.logger.debug(`Cache MISS: ${key}`);
        return null;
      }

      const value = await this.redis!.get(key);
      if (value) {
        this.logger.debug(`Cache HIT: ${key}`);
        return JSON.parse(value) as T;
      }
      this.logger.debug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      this.logger.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a key from cache
   */
  async delete(key: string): Promise<void> {
    try {
      if (!this.connected) return;
      if (this.upstash) {
        await this.upstash.del(key);
      } else {
        await this.redis!.del(key);
      }
      this.logger.debug(`Cache DELETE: ${key}`);
    } catch (error) {
      this.logger.error(`Cache DELETE error for key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys from cache (pattern-based)
   * Warning: This uses SCAN and DEL, works for pattern deletion
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      if (!this.connected) return;
      // Get all keys matching pattern
      const keys = this.upstash
        ? await this.upstash.keys(pattern)
        : await this.redis!.keys(pattern);
      if (keys.length > 0) {
        if (this.upstash) {
          await this.upstash.del(...keys);
        } else {
          await this.redis!.del(keys);
        }
        this.logger.debug(
          `Cache DELETE PATTERN: ${pattern} (${keys.length} keys)`,
        );
      }
    } catch (error) {
      this.logger.error(`Cache DELETE PATTERN error for ${pattern}:`, error);
    }
  }

  /**
   * Clear entire cache (use with caution!)
   */
  async flushAll(): Promise<void> {
    try {
      if (!this.connected) return;
      if (this.upstash) {
        await this.upstash.flushdb();
      } else {
        await this.redis!.flushDb();
      }
      this.logger.warn('Cache FLUSH ALL');
    } catch (error) {
      this.logger.error('Cache FLUSH ALL error:', error);
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.connected) return false;
      const exists = this.upstash
        ? await this.upstash.exists(key)
        : await this.redis!.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Increment a numeric value (for counters)
   */
  async increment(key: string, increment = 1): Promise<number> {
    try {
      if (!this.connected) return 0;
      const result = this.upstash
        ? await this.upstash.incrby(key, increment)
        : await this.redis!.incrBy(key, increment);
      return result;
    } catch (error) {
      this.logger.error(`Cache INCREMENT error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Get or set a value (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL,
  ): Promise<T> {
    try {
      // Try to get from cache
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, execute function
      const value = await fn();

      // Store in cache
      await this.set(key, value, ttl);

      return value;
    } catch (error) {
      this.logger.error(`Cache GET_OR_SET error for key ${key}:`, error);
      // If cache fails, still execute function
      return fn();
    }
  }

  /**
   * Test Redis connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.connected) return false;
      if (this.upstash) {
        await this.upstash.set('health-check', 'ok');
      } else {
        await this.redis!.set('health-check', 'ok');
      }
      const result = this.upstash
        ? await this.upstash.get('health-check')
        : await this.redis!.get('health-check');
      return result === 'ok';
    } catch (error) {
      this.logger.error('Redis connection test failed:', error);
      return false;
    }
  }
}
