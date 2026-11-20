const sequelize = require('../config/database');
const Country = require('./Country');
const Currency = require('./Currency');
const Tenant = require('./Tenant');
const User = require('./User');
const TenantSettings = require('./TenantSettings');
const HelpText = require('./HelpText');

// Associations
Tenant.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
Tenant.belongsTo(Currency, { foreignKey: 'currency_id', as: 'currency' });
Tenant.hasMany(User, { foreignKey: 'tenant_id', as: 'users' });
Tenant.hasOne(TenantSettings, { foreignKey: 'tenant_id', as: 'settings' });

User.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

TenantSettings.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

Country.hasMany(Tenant, { foreignKey: 'country_id', as: 'tenants' });
Currency.hasMany(Tenant, { foreignKey: 'currency_id', as: 'tenants' });

module.exports = {
  sequelize,
  Country,
  Currency,
  Tenant,
  User,
  TenantSettings,
  HelpText,
};
