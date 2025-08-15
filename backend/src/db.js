import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config.js';

if (!DATABASE_URL) {
  console.warn('DATABASE_URL not set. Please configure your Supabase Postgres connection.');
}

export const sequelize = new Sequelize(DATABASE_URL, {
  development: {
    username: "postgres",
    password: "localpass",
    database: "localdb",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  }
});
