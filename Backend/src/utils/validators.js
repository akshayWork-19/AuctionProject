import { z } from 'zod';

export const createAuctionSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  startingPrice: z.number().int().positive(),
  bidIncrement: z.number().int().positive(),
  goLiveAt: z.string().or(z.date()),
  durationSeconds: z.number().int().positive(),
  sellerId: z.string().uuid(),
});

export const bidSchema = z.object({
  auctionId: z.string().uuid(),
  bidderId: z.string().uuid(),
  amount: z.number().int().positive(),
});

export const decisionSchema = z.object({
  auctionId: z.string().uuid(),
  sellerId: z.string().uuid(),
  action: z.enum(['accept','reject','counter']),
  counterPrice: z.number().int().positive().optional(),
});

export const counterRespondSchema = z.object({
  counterOfferId: z.string().uuid(),
  bidderId: z.string().uuid(),
  action: z.enum(['accept','reject']),
});
