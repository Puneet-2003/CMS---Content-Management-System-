const { Media } = require('../models');
const fs = require('fs');
const path = require('path');

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      path: req.file.path,
      size: req.file.size
    });

    res.status(201).json({
      id: media.id,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      path: media.path,
      size: media.size,
      url: `/uploads/${media.filename}`,
      createdAt: media.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await Media.findAll({
      order: [['createdAt', 'DESC']]
    });

    const mediaWithUrls = media.map(item => ({
      id: item.id,
      filename: item.filename,
      originalName: item.originalName,
      mimeType: item.mimeType,
      path: item.path,
      size: item.size,
      url: `/uploads/${item.filename}`,
      createdAt: item.createdAt
    }));

    res.json(mediaWithUrls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

   
    const filePath = path.join(__dirname, '..', media.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await media.destroy();
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia
};