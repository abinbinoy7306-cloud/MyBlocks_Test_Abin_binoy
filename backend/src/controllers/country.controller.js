const { Country } = require('../models');

const listCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });
    return res.json({ success: true, data: countries });
  } catch (err) {
    console.error('listCountries error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    return res.json({ success: true, data: country });
  } catch (err) {
    console.error('getCountry error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { listCountries, getCountry };
