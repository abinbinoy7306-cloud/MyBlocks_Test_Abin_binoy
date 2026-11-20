const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TenantSettings = sequelize.define('TenantSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
  },
  date_format: {
    type: DataTypes.STRING,
    defaultValue: 'DD/MM/YYYY',
  },
  fiscal_year_start: {
    type: DataTypes.STRING,
    defaultValue: '01-01',
  },
  is_gst_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  gstin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'tenant_settings',
  timestamps: true,
});

module.exports = TenantSettings;
