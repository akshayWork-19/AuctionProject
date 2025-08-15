import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config.js';

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Render / Production
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    }
  });
} else {
  // Local development
  sequelize = new Sequelize('localdb', 'postgres', 'localpass', {
    host: '127.0.0.1',
    dialect: 'postgres'
  });
}

export { sequelize };
