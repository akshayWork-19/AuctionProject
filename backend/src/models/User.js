import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class User extends Model { }

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('buyer', 'seller', 'admin'), defaultValue: 'buyer' },
}, { sequelize, modelName: 'user' });
