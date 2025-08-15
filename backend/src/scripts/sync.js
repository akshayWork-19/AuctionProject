import '../config.js';
import { sequelize } from '../db.js';
import '../models/User.js';
import '../models/Auction.js';
import '../models/Bid.js';
import '../models/CounterOffer.js';
import '../models/Notification.js';

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB sync completed.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
