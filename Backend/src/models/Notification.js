import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Notification extends Model {}

Notification.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
  auctionId: { type: DataTypes.UUID, allowNull: true },
}, { sequelize, modelName: 'notification' });
