import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import AuctionCard from '../components/AuctionCard'

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/auctions').then(r => setItems(r.data))
  }, [])

  return (
    <div>
      <h3>All Auctions</h3>
      {items.map(a => <AuctionCard key={a.id} a={a} />)}
      {!items.length && <p>No auctions yet.</p>}
    </div>
  )
}
