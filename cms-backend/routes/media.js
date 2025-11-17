const express = require('express');
const upload = require('../middleware/upload');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadMedia, getMedia, deleteMedia } = require('../controllers/mediaController');

const router = express.Router();

router.post('/upload', authenticateToken, requireAdmin, upload.single('file'), uploadMedia);
router.get('/', authenticateToken, requireAdmin, getMedia);
router.delete('/:id', authenticateToken, requireAdmin, deleteMedia);

module.exports = router;