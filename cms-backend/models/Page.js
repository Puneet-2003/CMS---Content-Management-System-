const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Page = sequelize.define('Page', {
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
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Page;