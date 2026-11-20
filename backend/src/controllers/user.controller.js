const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Tenant } = require('../models');
const { ROLES } = require('../config/constants');

const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {};

    // Super admin sees all; others only see their own tenant
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      where.tenant_id = req.user.tenant_id;
      // Manager can only see team_user role
      if (req.user.role === ROLES.MANAGER) {
        where.role = ROLES.TEAM_USER;
      }
    }

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Tenant, as: 'tenant', attributes: ['id', 'name', 'slug'] }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.json({
      success: true,
      data: { users: rows, total: count, page, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    console.error('listUsers error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, tenant_id, avatar_url } = req.body;

    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'first_name, last_name, email, password, role are required' });
    }

    // Role permission checks
    if (req.user.role === ROLES.MANAGER && role !== ROLES.TEAM_USER) {
      return res.status(403).json({ success: false, message: 'Managers can only create team_user accounts' });
    }

    if (req.user.role === ROLES.FIRM_ADMIN && [ROLES.SUPER_ADMIN, ROLES.FIRM_ADMIN].includes(role)) {
      return res.status(403).json({ success: false, message: 'Firm admin cannot create super_admin or firm_admin accounts' });
    }

    // Determine tenant
    let targetTenantId = tenant_id;
    if (req.user.role !== ROLES.SUPER_ADMIN) {
      targetTenantId = req.user.tenant_id;
    }

    if (role !== ROLES.SUPER_ADMIN && !targetTenantId) {
      return res.status(400).json({ success: false, message: 'tenant_id is required for non-super_admin users' });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      tenant_id: targetTenantId || null,
      avatar_url,
    });

    // Return without password
    const safeUser = await User.findByPk(user.id);
    return res.status(201).json({ success: true, message: 'User created', data: safeUser });
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Tenant, as: 'tenant', attributes: ['id', 'name', 'slug'] }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Non-super_admin can only view their own tenant's users
    if (req.user.role !== ROLES.SUPER_ADMIN && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('getUser error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Tenant boundary check
    if (req.user.role !== ROLES.SUPER_ADMIN && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { first_name, last_name, avatar_url, is_active } = req.body;
    const updates = {};
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (is_active !== undefined && [ROLES.SUPER_ADMIN, ROLES.FIRM_ADMIN].includes(req.user.role)) {
      updates.is_active = is_active;
    }

    await user.update(updates);
    const safeUser = await User.findByPk(user.id);
    return res.json({ success: true, message: 'User updated', data: safeUser });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Tenant boundary check
    if (req.user.role !== ROLES.SUPER_ADMIN && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await user.update({ is_active: false });
    return res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    console.error('deactivateUser error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await User.scope('withPassword').findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Tenant boundary check
    if (req.user.role !== ROLES.SUPER_ADMIN && user.tenant_id !== req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { new_password } = req.body;
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'new_password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(new_password, 12);
    await user.update({ password: hashed, refresh_token: null });

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { listUsers, createUser, getUser, updateUser, deactivateUser, resetPassword };
