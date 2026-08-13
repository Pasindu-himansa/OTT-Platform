const { createClient } = require("redis");
const logger = require("../utils/logger");

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => logger.error("Redis error:", err));

async function connectRedis() {
  await client.connect();
  logger.info("✅ Redis connected");
}

const set = (key, value, ttlSeconds) =>
  client.set(
    key,
    JSON.stringify(value),
    ttlSeconds ? { EX: ttlSeconds } : undefined,
  );

const get = async (key) => {
  const val = await client.get(key);
  return val ? JSON.parse(val) : null;
};

const del = (key) => client.del(key);

module.exports = { client, connectRedis, set, get, del };
