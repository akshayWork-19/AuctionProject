import { Server } from 'socket.io';
import { ORIGIN } from '../config.js';

export let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: ORIGIN, credentials: true }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
    if (userId) {
      socket.join(userId); // for per-user notifications
    }

    socket.on('join-auction', ({ auctionId }) => {
      socket.join(`auction:${auctionId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
}
