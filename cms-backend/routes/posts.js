const express = require('express');
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  togglePublish
} = require('../controllers/postController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPost);
router.post('/', authenticateToken, requireAdmin, createPost);
router.put('/:id', authenticateToken, requireAdmin, updatePost);
router.delete('/:id', authenticateToken, requireAdmin, deletePost);
router.patch('/:id/publish', authenticateToken, requireAdmin, togglePublish);

module.exports = router;