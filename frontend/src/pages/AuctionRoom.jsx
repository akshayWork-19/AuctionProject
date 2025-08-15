import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { socket } from '../lib/socket'

export default function AuctionRoom() {
  const { id } = useParams()
  const [auction, setAuction] = useState(null)
  const [highest, setHighest] = useState(null)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    api.get(`/auctions/${id}`).then(r => {
      setAuction(r.data.auction)
      setHighest(r.data.highestBid)
      socket.emit('join-auction', { auctionId: id })
    })
    socket.on('new-bid', d => {
      if (d.auctionId === id) setHighest({ amount: d.bid.amount })
    })
    return () => socket.off('new-bid')
  }, [id])

  if (!auction) return <p>Loading...</p>

  return (
    <div>
      <h3>{auction.title}</h3>
      <p>Current highest: ₹{highest?.amount ?? '—'}</p>
      {auction.status === 'live' && (
        <>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          <button onClick={async () => {
            await api.post('/bids', { auctionId: id, bidderId: '00000000-0000-0000-0000-000000000002', amount: Number(amount) })
            setAmount('')
          }}>Bid</button>
        </>
      )}
    </div>
  )
}
