const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iso2: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    unique: true,
  },
  iso3: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    unique: true,
  },
  phone_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  flag_emoji: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'countries',
  timestamps: true,
});

module.exports = Country;
