const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/tenants', require('./tenant.routes'));
router.use('/users', require('./user.routes'));
router.use('/countries', require('./country.routes'));
router.use('/currencies', require('./currency.routes'));
router.use('/help-texts', require('./helpText.routes'));

module.exports = router;
