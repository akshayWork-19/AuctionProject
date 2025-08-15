import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Auction extends Model {}

Auction.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  startingPrice: { type: DataTypes.INTEGER, allowNull: false },
  bidIncrement: { type: DataTypes.INTEGER, allowNull: false },
  goLiveAt: { type: DataTypes.DATE, allowNull: false },
  durationSeconds: { type: DataTypes.INTEGER, allowNull: false },
  sellerId: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.ENUM('scheduled','live','ended','closed'), defaultValue: 'scheduled' },
  winnerBidId: { type: DataTypes.UUID, allowNull: true },
}, { sequelize, modelName: 'auction' });
