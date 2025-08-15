import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config.js';

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set. Please configure your Supabase Postgres connection.');
}

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
