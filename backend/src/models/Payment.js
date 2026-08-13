const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgres");

const Payment = sequelize.define(
  "Payment",
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
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
    },
    method: {
      type: DataTypes.STRING(50), // card, paypal, stripe etc
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    gateway: {
      type: DataTypes.STRING(50), // stripe, paypal, razorpay
      allowNull: true,
    },
    gatewayResponse: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["status"] },
      { fields: ["transactionId"] },
    ],
  },
);

module.exports = Payment;
