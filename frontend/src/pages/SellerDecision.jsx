import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function SellerDecision() {
  const { id } = useParams()
  const [auction, setAuction] = useState(null)
  const [counterPrice, setCounterPrice] = useState('')

  useEffect(() => {
    api.get(`/auctions/${id}`).then(r => setAuction(r.data.auction))
  }, [id])

  if (!auction) return <p>Loading...</p>

  return (
    <div>
      <h3>Seller Decision — {auction.title}</h3>
      <button onClick={() => api.post('/seller/decision', { auctionId: id, sellerId: auction.sellerId, action: 'accept' })}>Accept</button>
      <button onClick={() => api.post('/seller/decision', { auctionId: id, sellerId: auction.sellerId, action: 'reject' })}>Reject</button>
      <input type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} placeholder="Counter price" />
      <button onClick={() => api.post('/seller/decision', { auctionId: id, sellerId: auction.sellerId, action: 'counter', counterPrice: Number(counterPrice) })}>Counter</button>
    </div>
  )
}
