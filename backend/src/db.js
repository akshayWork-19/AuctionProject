import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config.js';

const sequelize = new Sequelize(
  DATABASE_URL,   // Use full DATABASE_URL
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
    },
  }
);

export {
  sequelize
};