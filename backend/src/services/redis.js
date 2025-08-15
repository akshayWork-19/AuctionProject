import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN } from '../config.js';

export const redis = new Redis({
  url: UPSTASH_REDIS_URL || '',
  token: UPSTASH_REDIS_TOKEN || '',
});

export const highestBidKey = (auctionId) => `auction:${auctionId}:highestBid`;
export const participantsKey = (auctionId) => `auction:${auctionId}:participants`; // set of userIds

export async function getHighestBid(auctionId) {
  const data = await redis.get(highestBidKey(auctionId));
  return data ? data : null;
}

export async function setHighestBid(auctionId, payload) {
  await redis.set(highestBidKey(auctionId), payload);
}

export async function addParticipant(auctionId, userId) {
  await redis.sadd(participantsKey(auctionId), userId);
}

export async function getParticipants(auctionId) {
  return (await redis.smembers(participantsKey(auctionId))) || [];
}
