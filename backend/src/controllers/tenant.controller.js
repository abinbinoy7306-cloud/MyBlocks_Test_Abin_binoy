const { Op } = require('sequelize');
const { Tenant, User, TenantSettings, Country, Currency } = require('../models');
const { ROLES } = require('../config/constants');

const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const listTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Tenant.findAndCountAll({
      where,
      include: [
        { model: Country, as: 'country', attributes: ['id', 'name', 'iso2', 'flag_emoji'] },
        { model: Currency, as: 'currency', attributes: ['id', 'name', 'code', 'symbol'] },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.json({
      success: true,
      data: {
        tenants: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error('listTenants error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createTenant = async (req, res) => {
  try {
    const { name, country_id, currency_id, plan, logo_url } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Tenant name is required' });
    }

    const slug = slugify(name);

    const existing = await Tenant.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A tenant with this name already exists' });
    }

    const tenant = await Tenant.create({ name, slug, country_id, currency_id, plan, logo_url });

    // Auto-create settings
    await TenantSettings.create({ tenant_id: tenant.id });

    return res.status(201).json({ success: true, message: 'Tenant created', data: tenant });
  } catch (err) {
    console.error('createTenant error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [
        { model: Country, as: 'country' },
        { model: Currency, as: 'currency' },
        { model: TenantSettings, as: 'settings' },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    return res.json({ success: true, data: tenant });
  } catch (err) {
    console.error('getTenant error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    const { name, country_id, currency_id, plan, logo_url, is_active } = req.body;

    const updates = {};
    if (name !== undefined) {
      updates.name = name;
      updates.slug = slugify(name);
    }
    if (country_id !== undefined) updates.country_id = country_id;
    if (currency_id !== undefined) updates.currency_id = currency_id;
    if (plan !== undefined) updates.plan = plan;
    if (logo_url !== undefined) updates.logo_url = logo_url;
    if (is_active !== undefined) updates.is_active = is_active;

    await tenant.update(updates);

    return res.json({ success: true, message: 'Tenant updated', data: tenant });
  } catch (err) {
    console.error('updateTenant error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    // Soft delete
    await tenant.update({ is_active: false });

    return res.json({ success: true, message: 'Tenant deactivated' });
  } catch (err) {
    console.error('deleteTenant error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTenantUsers = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    const users = await User.findAll({
      where: { tenant_id: req.params.id },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: users });
  } catch (err) {
    console.error('getTenantUsers error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTenantStats = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    const users = await User.findAll({ where: { tenant_id: req.params.id } });

    const stats = {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      byRole: {
        firm_admin: users.filter(u => u.role === ROLES.FIRM_ADMIN).length,
        manager: users.filter(u => u.role === ROLES.MANAGER).length,
        team_user: users.filter(u => u.role === ROLES.TEAM_USER).length,
      },
    };

    return res.json({ success: true, data: stats });
  } catch (err) {
    console.error('getTenantStats error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getTenantSettings = async (req, res) => {
  try {
    let settings = await TenantSettings.findOne({ where: { tenant_id: req.params.id } });
    if (!settings) {
      settings = await TenantSettings.create({ tenant_id: req.params.id });
    }
    return res.json({ success: true, data: settings });
  } catch (err) {
    console.error('getTenantSettings error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateTenantSettings = async (req, res) => {
  try {
    let settings = await TenantSettings.findOne({ where: { tenant_id: req.params.id } });
    if (!settings) {
      settings = await TenantSettings.create({ tenant_id: req.params.id });
    }

    const { timezone, date_format, fiscal_year_start, is_gst_enabled, gstin } = req.body;
    const updates = {};
    if (timezone !== undefined) updates.timezone = timezone;
    if (date_format !== undefined) updates.date_format = date_format;
    if (fiscal_year_start !== undefined) updates.fiscal_year_start = fiscal_year_start;
    if (is_gst_enabled !== undefined) updates.is_gst_enabled = is_gst_enabled;
    if (gstin !== undefined) updates.gstin = gstin;

    await settings.update(updates);

    return res.json({ success: true, message: 'Settings updated', data: settings });
  } catch (err) {
    console.error('updateTenantSettings error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  listTenants,
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
  getTenantUsers,
  getTenantStats,
  getTenantSettings,
  updateTenantSettings,
};
