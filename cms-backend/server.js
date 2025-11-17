const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const pageRoutes = require('./routes/pages');
const mediaRoutes = require('./routes/media');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large. Maximum size is 5MB.' 
    });
  }
  
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors 
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ 
      error: 'Resource already exists'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Invalid token' 
    });
  }

  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

startServer();