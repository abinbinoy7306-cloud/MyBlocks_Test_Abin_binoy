const { ROLES } = require('../config/constants');

/**
 * Enforces tenant scoping: non-super_admin users can only access their own tenant's data.
 * Attaches req.tenantId.
 */
const tenantScope = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.user.role === ROLES.SUPER_ADMIN) {
    // Super admin can access any tenant; tenantId may come from param or query
    req.tenantId = req.params.tenantId || req.params.id || req.query.tenant_id || null;
  } else {
    // Non-super_admin users are locked to their own tenant
    req.tenantId = req.user.tenant_id;
  }

  next();
};

module.exports = { tenantScope };
