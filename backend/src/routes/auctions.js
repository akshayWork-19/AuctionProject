import { Router } from 'express';
import dayjs from 'dayjs';
import { Auction } from '../models/Auction.js';
import { Bid } from '../models/Bid.js';
import { createAuctionSchema } from '../utils/validators.js';
import { io } from '../services/socket.js';
import { getHighestBid, setHighestBid } from '../services/redis.js';

export const auctions = Router();

// Create auction
auctions.post('/', async (req, res, next) => {
  try {
    const parsed = createAuctionSchema.parse(req.body);
    const auction = await Auction.create({
      ...parsed,
      status: dayjs(parsed.goLiveAt).isAfter(dayjs()) ? 'scheduled' : 'live'
    });
    res.json(auction);
  } catch (e) { next(e); }
});

// List auctions
auctions.get('/', async (req, res, next) => {
  try {
    const list = await Auction.findAll({ order: [['createdAt','DESC']] });
    res.json(list);
  } catch (e) { next(e); }
});

// Get single auction (with current highest bid from Redis)
auctions.get('/:id', async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) return res.status(404).json({ error: 'Not found' });
    const highest = await getHighestBid(auction.id);
    res.json({ auction, highestBid: highest });
  } catch (e) { next(e); }
});

// Internal: mark auction ended (trigger via scheduler or frontend)
auctions.post('/:id/end', async (req, res, next) => {
  try {
    const auction = await Auction.findByPk(req.params.id);
    if (!auction) return res.status(404).json({ error: 'Not found' });
    auction.status = 'ended';
    // determine highest bid from DB just in case
    const top = await Bid.findOne({ where: { auctionId: auction.id }, order: [['amount', 'DESC']] });
    if (top) {
      auction.winnerBidId = top.id;
      await setHighestBid(auction.id, { amount: top.amount, bidderId: top.bidderId });
    }
    await auction.save();
    io.to(`auction:${auction.id}`).emit('auction-ended', { auctionId: auction.id });
    res.json({ ok: true });
  } catch (e) { next(e); }
});
