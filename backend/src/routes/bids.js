import { Router } from 'express';
import { Bid } from '../models/Bid.js';
import { Auction } from '../models/Auction.js';
import { bidSchema } from '../utils/validators.js';
import { getHighestBid, setHighestBid, addParticipant, getParticipants } from '../services/redis.js';
import { io } from '../services/socket.js';
import { createNotification } from '../services/notify.js';

export const bids = Router();

bids.post('/', async (req, res, next) => {
  try {
    const { auctionId, bidderId, amount } = bidSchema.parse(req.body);
    const auction = await Auction.findByPk(auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    if (auction.status !== 'live') return res.status(400).json({ error: 'Auction is not live' });

    const highest = await getHighestBid(auctionId);
    const current = highest?.amount ?? auction.startingPrice - auction.bidIncrement;

    if (amount < current + auction.bidIncrement) {
      return res.status(400).json({ error: `Bid must be at least ${(current + auction.bidIncrement)}` });
    }

    const bid = await Bid.create({ auctionId, bidderId, amount });
    await setHighestBid(auctionId, { amount, bidderId });
    await addParticipant(auctionId, bidderId);

    // Notify seller & participants
    io.to(`auction:${auctionId}`).emit('new-bid', { auctionId, bid: bid.toJSON() });

    // In-app notifications
    await createNotification({
      userId: auction.sellerId,
      type: 'new_bid',
      message: `New bid ₹${amount} on "${auction.title}"`,
      auctionId
    });

    // Outbid notifications (everyone except current bidder)
    const participants = await getParticipants(auctionId);
    await Promise.all(participants
      .filter(uid => uid !== bidderId)
      .map(uid => createNotification({
        userId: uid,
        type: 'outbid',
        message: `You have been outbid at ₹${amount} on "${auction.title}"`,
        auctionId
      }))
    );

    res.json({ ok: true, bid });
  } catch (e) { next(e); }
});
