import { RedisOptions } from "ioredis";
import config from ".";

export const redisConfig: RedisOptions = {
  host: config.redis.redis_ip || "127.0.0.1",
  port: Number(config.redis.redis_port) || 6379,
  maxRetriesPerRequest: null,
};