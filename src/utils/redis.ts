import { createClient, RedisClientType } from 'redis';
import envs from './env';

let client: RedisClientType;

export default async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({ url: envs.redisUrl });
    await client.connect();
  }
  return client;
}
