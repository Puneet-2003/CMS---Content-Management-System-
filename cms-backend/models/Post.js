const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title is required'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Content is required'
      }
    }
  },
  excerpt: {
    type: DataTypes.TEXT
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE
  }
});

module.exports = Post;