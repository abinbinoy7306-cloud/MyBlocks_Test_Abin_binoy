const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Currency = sequelize.define('Currency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    unique: true,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  decimal_places: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'currencies',
  timestamps: true,
});

module.exports = Currency;
