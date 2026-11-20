const { Currency } = require('../models');

const listCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });
    return res.json({ success: true, data: currencies });
  } catch (err) {
    console.error('listCurrencies error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCurrency = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.id);
    if (!currency) {
      return res.status(404).json({ success: false, message: 'Currency not found' });
    }
    return res.json({ success: true, data: currency });
  } catch (err) {
    console.error('getCurrency error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { listCurrencies, getCurrency };
