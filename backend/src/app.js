require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { connectPostgres } = require("./config/postgres");
const { connectMongo } = require("./config/mongo");
const { connectRedis } = require("./config/redis");
const logger = require("./utils/logger");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
    hsts: false,
  }),
);

app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: "Too many requests, try again later." },
  }),
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }),
);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1", routes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: process.env.APP_NAME,
    env: process.env.NODE_ENV,
  });
});

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

async function start() {
  try {
    await connectPostgres();
    await connectMongo();
    await connectRedis();
    app.listen(PORT, () => {
      logger.info(`🚀 OTT API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
module.exports = app;
