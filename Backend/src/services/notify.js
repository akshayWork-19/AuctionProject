import { Notification } from '../models/Notification.js';
import { io } from './socket.js';

export async function createNotification({ userId, type, message, auctionId }) {
  const notif = await Notification.create({ userId, type, message, auctionId });
  io.to(userId).emit('notification', notif.toJSON());
  return notif;
}
