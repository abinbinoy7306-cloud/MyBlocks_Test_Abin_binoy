const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const {
  listTenants,
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
  getTenantUsers,
  getTenantStats,
  getTenantSettings,
  updateTenantSettings,
} = require('../controllers/tenant.controller');

const superAdminOnly = [authenticate, requireRole(['super_admin'])];

router.get('/', ...superAdminOnly, listTenants);
router.post('/', ...superAdminOnly, createTenant);
router.get('/:id', ...superAdminOnly, getTenant);
router.put('/:id', ...superAdminOnly, updateTenant);
router.delete('/:id', ...superAdminOnly, deleteTenant);
router.get('/:id/users', ...superAdminOnly, getTenantUsers);
router.get('/:id/stats', ...superAdminOnly, getTenantStats);
router.get('/:id/settings', authenticate, requireRole(['super_admin', 'firm_admin']), getTenantSettings);
router.put('/:id/settings', authenticate, requireRole(['super_admin', 'firm_admin']), updateTenantSettings);

module.exports = router;
