import { Router } from 'express';
import { decisionSchema, counterRespondSchema } from '../utils/validators.js';
import { Auction } from '../models/Auction.js';
import { Bid } from '../models/Bid.js';
import { CounterOffer } from '../models/CounterOffer.js';
import { createNotification } from '../services/notify.js';
import { sendEmail } from '../services/mail.js';
import { generateInvoicePDF } from '../services/invoice.js';
import { v4 as uuidv4 } from 'uuid';

export const seller = Router();

seller.post('/decision', async (req, res, next) => {
  try {
    const { auctionId, sellerId, action, counterPrice } = decisionSchema.parse(req.body);
    const auction = await Auction.findByPk(auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });
    if (auction.sellerId !== sellerId) return res.status(403).json({ error: 'Not owner' });
    if (auction.status !== 'ended') return res.status(400).json({ error: 'Auction must be ended to decide' });

    const topBid = await Bid.findOne({ where: { auctionId }, order: [['amount', 'DESC']] });
    if (!topBid) return res.status(400).json({ error: 'No bids to decide on' });

    if (action === 'accept') {
      auction.status = 'closed';
      auction.winnerBidId = topBid.id;
      await auction.save();

      await createNotification({ userId: topBid.bidderId, type: 'bid_accepted', message: `Your bid ₹${topBid.amount} was accepted`, auctionId });

      // Generate invoice
      const invoiceId = uuidv4();
      // Fetch minimal user objects (mock via emails on Bid/Auction? In real app join with User model)
      const buyer = { id: topBid.bidderId, name: 'Buyer', email: 'buyer@example.com' };
      const sellerU = { id: auction.sellerId, name: 'Seller', email: 'seller@example.com' };
      const pdfPath = await generateInvoicePDF({ invoiceId, buyer, seller: sellerU, item: auction.title, amount: topBid.amount });

      // Emails
      await sendEmail({ to: buyer.email, subject: 'Purchase Confirmation', html: `<p>Your bid for "${auction.title}" was accepted. Amount: ₹${topBid.amount}</p>`, attachments: [{ path: pdfPath, filename: `invoice-${invoiceId}.pdf` }] });
      await sendEmail({ to: sellerU.email, subject: 'Sale Confirmation', html: `<p>You accepted a bid for "${auction.title}" at ₹${topBid.amount}</p>`, attachments: [{ path: pdfPath, filename: `invoice-${invoiceId}.pdf` }] });

      return res.json({ ok: true, status: auction.status });
    }

    if (action === 'reject') {
      auction.status = 'closed';
      auction.winnerBidId = null;
      await auction.save();
      await createNotification({ userId: topBid.bidderId, type: 'bid_rejected', message: `Seller rejected the highest bid for "${auction.title}"`, auctionId });
      return res.json({ ok: true, status: auction.status });
    }

    if (action === 'counter') {
      if (!counterPrice) return res.status(400).json({ error: 'counterPrice is required' });
      const co = await CounterOffer.create({ auctionId, sellerId, bidderId: topBid.bidderId, price: counterPrice, status: 'pending' });
      await createNotification({ userId: topBid.bidderId, type: 'counter_offer', message: `Seller proposed ₹${counterPrice} for "${auction.title}"`, auctionId });
      return res.json({ ok: true, counterOffer: co });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) { next(e); }
});

seller.post('/counter/respond', async (req, res, next) => {
  try {
    const { counterOfferId, bidderId, action } = counterRespondSchema.parse(req.body);
    const co = await CounterOffer.findByPk(counterOfferId);
    if (!co) return res.status(404).json({ error: 'Counter-offer not found' });
    if (co.bidderId !== bidderId) return res.status(403).json({ error: 'Not authorized' });
    if (co.status !== 'pending') return res.status(400).json({ error: 'Already decided' });

    const auction = await Auction.findByPk(co.auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction missing' });

    if (action === 'accept') {
      co.status = 'accepted'; await co.save();
      auction.status = 'closed'; await auction.save();

      await createNotification({ userId: co.sellerId, type: 'counter_accepted', message: `Buyer accepted counter-offer ₹${co.price} on "${auction.title}"`, auctionId: auction.id });
      await createNotification({ userId: bidderId, type: 'bid_accepted', message: `Your counter-accept confirmed at ₹${co.price} for "${auction.title}"`, auctionId: auction.id });

      // Generate invoice & send emails
      const invoiceId = uuidv4();
      const buyer = { id: bidderId, name: 'Buyer', email: 'buyer@example.com' };
      const sellerU = { id: co.sellerId, name: 'Seller', email: 'seller@example.com' };
      const pdfPath = await generateInvoicePDF({ invoiceId, buyer, seller: sellerU, item: auction.title, amount: co.price });

      await sendEmail({ to: buyer.email, subject: 'Purchase Confirmation', html: `<p>Counter-offer accepted for "${auction.title}" Amount: ₹${co.price}</p>`, attachments: [{ path: pdfPath, filename: `invoice-${invoiceId}.pdf` }] });
      await sendEmail({ to: sellerU.email, subject: 'Sale Confirmation', html: `<p>Counter-offer accepted by buyer for "${auction.title}" at ₹${co.price}</p>`, attachments: [{ path: pdfPath, filename: `invoice-${invoiceId}.pdf` }] });

      return res.json({ ok: true });
    }

    if (action === 'reject') {
      co.status = 'rejected'; await co.save();
      await createNotification({ userId: co.sellerId, type: 'counter_rejected', message: `Buyer rejected counter-offer on "${auction.title}"`, auctionId: auction.id });
      await createNotification({ userId: bidderId, type: 'counter_rejected', message: `You rejected seller's counter-offer for "${auction.title}"`, auctionId: auction.id });
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) { next(e); }
});
