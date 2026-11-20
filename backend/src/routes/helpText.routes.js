const express = require('express');
const router = express.Router();
const helpTextController = require('../controllers/helpText.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Read access: any authenticated user
router.get('/', authenticate, helpTextController.getAllHelpTexts);
router.get('/:section_key', authenticate, helpTextController.getHelpTextBySection);

// Write/Edit access: super_admin and firm_admin
router.put(
  '/:section_key',
  authenticate,
  requireRole('super_admin', 'firm_admin'),
  helpTextController.upsertHelpText
);

module.exports = router;
