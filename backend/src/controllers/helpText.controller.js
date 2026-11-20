const { HelpText } = require('../models');

const getAllHelpTexts = async (req, res) => {
  try {
    const list = await HelpText.findAll({
      order: [['section_key', 'ASC']],
    });
    return res.json({ success: true, data: list });
  } catch (err) {
    console.error('getAllHelpTexts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve help texts' });
  }
};

const getHelpTextBySection = async (req, res) => {
  try {
    const { section_key } = req.params;
    let record = await HelpText.findOne({ where: { section_key } });

    if (!record) {
      return res.json({
        success: true,
        data: {
          section_key,
          title: 'Help & Information',
          content: 'No guidance has been configured for this section yet.',
          category: 'general',
        },
      });
    }

    return res.json({ success: true, data: record });
  } catch (err) {
    console.error('getHelpTextBySection error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve help text' });
  }
};

const upsertHelpText = async (req, res) => {
  try {
    const { section_key } = req.params;
    const { title, content, category } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const [record, created] = await HelpText.findOrCreate({
      where: { section_key },
      defaults: {
        section_key,
        title: title || 'Section Help',
        content,
        category: category || 'general',
        updated_by: req.user?.id || null,
      },
    });

    if (!created) {
      await record.update({
        title: title || record.title,
        content,
        category: category || record.category,
        updated_by: req.user?.id || null,
      });
    }

    return res.json({
      success: true,
      message: created ? 'Help text created successfully' : 'Help text updated successfully',
      data: record,
    });
  } catch (err) {
    console.error('upsertHelpText error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save help text' });
  }
};

module.exports = {
  getAllHelpTexts,
  getHelpTextBySection,
  upsertHelpText,
};
