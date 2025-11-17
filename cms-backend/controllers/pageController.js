const { Page, User } = require('../models');
const slugify = require('slugify');

const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'en'
  }) + '-' + Date.now();
};

const getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

const getPage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

const createPage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const slug = generateSlug(title);

    const page = await Page.create({
      title,
      slug,
      content,
      userId: req.user.id
    });

    const newPage = await Page.findByPk(page.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create page' });
  }
};

const updatePage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const page = await Page.findByPk(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    let slug = page.slug;
    if (title && title !== page.title) {
      slug = generateSlug(title);
    }

    await page.update({
      title: title || page.title,
      content: content || page.content,
      slug
    });

    const updatedPage = await Page.findByPk(page.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page' });
  }
};

const deletePage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    await page.destroy();
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
};

const togglePublishPage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const published = !page.published;
    await page.update({ published });

    res.json({ published });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle publish status' });
  }
};

module.exports = {
  getAllPages,
  getPage,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  togglePublishPage
};