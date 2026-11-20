const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { listCountries, getCountry } = require('../controllers/country.controller');

router.get('/', authenticate, listCountries);
router.get('/:id', authenticate, getCountry);

module.exports = router;
