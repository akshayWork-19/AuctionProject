import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class CounterOffer extends Model {}

CounterOffer.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  auctionId: { type: DataTypes.UUID, allowNull: false },
  sellerId: { type: DataTypes.UUID, allowNull: false },
  bidderId: { type: DataTypes.UUID, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending','accepted','rejected'), defaultValue: 'pending' },
}, { sequelize, modelName: 'counter_offer' });
