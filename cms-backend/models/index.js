const { sequelize, testConnection } = require('../config/database');
const User = require('./User');
const Post = require('./Post');
const Page = require('./Page');
const Media = require('./Media');

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Page, { foreignKey: 'userId' });
Page.belongsTo(User, { foreignKey: 'userId' });

const syncDatabase = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    

    await sequelize.sync({ force: false });
    console.log(' Database tables synced successfully');
    
    
    await createDefaultAdmin();
    
  } catch (error) {
    console.error(' Error syncing database:', error.message);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@cms.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Administrator',
        email: 'admin@cms.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log(' Default admin user created: admin@cms.com / admin123');
    } else {
      console.log('ℹ  Admin user already exists');
    }
  } catch (error) {
    console.error(' Error creating admin user:', error.message);
  }
};

module.exports = {
  sequelize,
  User,
  Post,
  Page,
  Media,
  syncDatabase
};