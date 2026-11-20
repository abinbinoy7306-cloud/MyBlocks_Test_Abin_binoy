const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Tenant } = require('../models');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
  return { accessToken, refreshToken };
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user including password
    const user = await User.scope('withPassword').findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token and update last_login
    await user.update({ refresh_token: refreshToken, last_login: new Date() });

    // Fetch tenant details if user belongs to a tenant
    let tenant = null;
    if (user.tenant_id) {
      tenant = await Tenant.findByPk(user.tenant_id, {
        attributes: ['id', 'name', 'slug', 'plan', 'country_id', 'currency_id'],
        include: [
          { association: 'country', attributes: ['id', 'name', 'iso2', 'flag_emoji'] },
          { association: 'currency', attributes: ['id', 'name', 'code', 'symbol'] },
        ],
      });
    }

    // Return user without password
    const safeUser = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      tenant_id: user.tenant_id,
      avatar_url: user.avatar_url,
      last_login: user.last_login,
      createdAt: user.createdAt,
    };

    return res.json({
      success: true,
      message: 'Login successful',
      data: { user: safeUser, accessToken, refreshToken, tenant },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.scope('withRefreshToken').findByPk(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token mismatch' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await user.update({ refresh_token: newRefreshToken });

    return res.json({
      success: true,
      message: 'Token refreshed',
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      await user.update({ refresh_token: null });
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ association: 'tenant', attributes: ['id', 'name', 'slug', 'plan'] }],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { login, refresh, logout, me };
