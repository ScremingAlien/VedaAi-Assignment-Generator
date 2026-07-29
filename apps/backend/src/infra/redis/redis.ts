import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined in environment variables');
}

export const redis = new (Redis as any)(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    return Math.min(times * 50, 2000);
  },
  reconnectOnError(err: any) {
    return err.message.includes('READONLY');
  },
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('ready', () => console.log('Redis ready'));
redis.on('error', (err: any) => console.error('Redis error:', err));
redis.on('close', () => console.log('Redis closed'));
