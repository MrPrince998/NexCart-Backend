import { createClient, RedisClientType } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';

/**
 * Redis Socket.IO Adapter Setup
 * Enables Socket.IO to work across multiple server instances
 * by using Redis as the message broker for cross-instance communication
 *
 * Usage in Gateway:
 * ```typescript
 * async afterInit(server: Server) {
 *   await setupRedisAdapter(server);
 * }
 * ```
 */
export async function setupRedisAdapter(
  server: Server,
): Promise<{ pubClient: RedisClientType; subClient: RedisClientType } | null> {
  try {
    if (!process.env.REDIS_URL) {
      console.log('Redis adapter skipped: REDIS_URL is not configured');
      return null;
    }

    const pubClient: RedisClientType = createClient({
      url: process.env.REDIS_URL,
    });

    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    // Set adapter for all namespaces
    server.adapter(createAdapter(pubClient, subClient));

    console.log('✅ Redis adapter connected for Socket.IO');
    return { pubClient, subClient };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.warn(
      '⚠️ Redis adapter failed, running in single-instance mode:',
      errorMessage,
    );
    // Continue without Redis adapter - works fine for single instance
    return null;
  }
}
