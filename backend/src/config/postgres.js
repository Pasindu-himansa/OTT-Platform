const { Sequelize, DataTypes } = require("sequelize");
const logger = require("../utils/logger");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: (msg) => logger.debug(msg),
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

// ─── PaymentMethod Model ──────────────────────────────────────
const PaymentMethod = sequelize.define(
  "PaymentMethod",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("visa", "mastercard", "amex", "paypal"),
      allowNull: false,
    },
    last4: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    expiryMonth: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    expiryYear: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    holderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "payment_methods",
    timestamps: true,
  },
);

async function connectPostgres() {
  await sequelize.authenticate();

  // Load models
  const User = require("../models/User");
  const Plan = require("../models/Plan");
  const Subscription = require("../models/Subscription");
  const Payment = require("../models/Payment");
  const Category = require("../models/Category");

  // Associations
  User.hasMany(Subscription, { foreignKey: "userId", as: "subscriptions" });
  Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

  Plan.hasMany(Subscription, { foreignKey: "planId", as: "subscriptions" });
  Subscription.belongsTo(Plan, { foreignKey: "planId", as: "plan" });

  User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
  Payment.belongsTo(User, { foreignKey: "userId", as: "user" });

  Plan.hasMany(Payment, { foreignKey: "planId", as: "payments" });
  Payment.belongsTo(Plan, { foreignKey: "planId", as: "plan" });

  Subscription.hasMany(Payment, {
    foreignKey: "subscriptionId",
    as: "payments",
  });
  Payment.belongsTo(Subscription, {
    foreignKey: "subscriptionId",
    as: "subscription",
  });

  User.hasMany(PaymentMethod, { foreignKey: "userId", as: "paymentMethods" });
  PaymentMethod.belongsTo(User, { foreignKey: "userId", as: "user" });

  await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
  logger.info("✅ PostgreSQL connected");
}

module.exports = { sequelize, connectPostgres, PaymentMethod };
