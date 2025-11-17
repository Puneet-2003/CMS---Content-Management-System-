const express = require('express');
const {
  getAllPages,
  getPage,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  togglePublishPage
} = require('../controllers/pageController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllPages);
router.get('/:id', getPage);
router.get('/slug/:slug', getPageBySlug);
router.post('/', authenticateToken, requireAdmin, createPage);
router.put('/:id', authenticateToken, requireAdmin, updatePage);
router.delete('/:id', authenticateToken, requireAdmin, deletePage);
router.patch('/:id/publish', authenticateToken, requireAdmin, togglePublishPage);

module.exports = router;