const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { listCurrencies, getCurrency } = require('../controllers/currency.controller');

router.get('/', authenticate, listCurrencies);
router.get('/:id', authenticate, getCurrency);

module.exports = router;
