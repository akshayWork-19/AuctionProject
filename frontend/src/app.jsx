import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import CreateAuction from './pages/CreateAuction'
import AuctionRoom from './pages/AuctionRoom'
import SellerDecision from './pages/SellerDecision'
import Notifications from './pages/Notifications'

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>🛎️ Mini Auction</h2>
        <Link to="/">Home</Link>
        <Link to="/create">Create Auction</Link>
        <Link to="/notifications">Notifications</Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateAuction />} />
        <Route path="/auction/:id" element={<AuctionRoom />} />
        <Route path="/seller/:id/decision" element={<SellerDecision />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </div>
  )
}
