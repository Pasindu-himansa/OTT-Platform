const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectMongo() {
  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );
  mongoose.connection.on("error", (err) => logger.error("MongoDB error:", err));
  await mongoose.connect(process.env.MONGO_URI);
  logger.info("✅ MongoDB connected");
}

module.exports = { connectMongo };
