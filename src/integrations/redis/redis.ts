import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Example usage (wrap in async function to avoid top-level await)
export async function testRedisConnection() {
  try {
    await redis.set('test', 'connection');
    const result = await redis.get('test');
    console.log('Redis connection test:', result);
  } catch (error) {
    console.error('Redis connection error:', error);
  }
}

export default redis;
