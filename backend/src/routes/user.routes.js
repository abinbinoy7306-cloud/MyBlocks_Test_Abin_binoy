const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { listUsers, createUser, getUser, updateUser, deactivateUser, resetPassword } = require('../controllers/user.controller');

router.get('/', authenticate, listUsers);
router.post('/', authenticate, requireRole(['super_admin', 'firm_admin', 'manager']), createUser);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, requireRole(['super_admin', 'firm_admin']), deactivateUser);
router.put('/:id/reset-password', authenticate, requireRole(['super_admin', 'firm_admin']), resetPassword);

module.exports = router;
