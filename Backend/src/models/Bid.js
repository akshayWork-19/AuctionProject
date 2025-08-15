import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Bid extends Model { }

Bid.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  auctionId: { type: DataTypes.UUID, allowNull: false },
  bidderId: { type: DataTypes.UUID, allowNull: false },
}, { sequelize, modelName: 'bid' });
