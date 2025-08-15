import React from 'react'
import { Link } from 'react-router-dom'

export default function AuctionCard({ a }) {
  const endAt = new Date(new Date(a.goLiveAt).getTime() + a.durationSeconds * 1000)
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
      <h3 style={{ marginTop: 0 }}>{a.title}</h3>
      <p style={{ margin: 0, color: '#555' }}>{a.description}</p>
      <small>Status: {a.status} • Go live: {new Date(a.goLiveAt).toLocaleString()} • Ends: {endAt.toLocaleString()}</small>
      <div style={{ marginTop: 8 }}>
        <Link to={`/auction/${a.id}`}>Open</Link>
      </div>
    </div>
  )
}
