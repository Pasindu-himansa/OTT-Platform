const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/postgres");

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: { type: DataTypes.TEXT },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    maxDevices: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    maxQuality: {
      type: DataTypes.ENUM("SD", "HD", "FHD", "4K"),
      defaultValue: "HD",
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "plans",
    timestamps: true,
  },
);

module.exports = Plan;
