import React, { useState } from 'react'
import { api } from '../lib/api'

export default function CreateAuction() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startingPrice: 100,
    bidIncrement: 10,
    goLiveAt: new Date().toISOString().slice(0, 16),
    durationSeconds: 300,
    sellerId: '00000000-0000-0000-0000-000000000001'
  })
  const [created, setCreated] = useState(null)

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: isNaN(value) ? value : Number(value) }))
  }

  async function create() {
    const res = await api.post('/auctions', form)
    setCreated(res.data)
  }

  return (
    <div>
      <h3>Create Auction</h3>
      <input name="title" value={form.title} onChange={onChange} placeholder="Title" />
      <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" />
      <input name="startingPrice" type="number" value={form.startingPrice} onChange={onChange} />
      <input name="bidIncrement" type="number" value={form.bidIncrement} onChange={onChange} />
      <input name="goLiveAt" type="datetime-local" value={form.goLiveAt} onChange={onChange} />
      <input name="durationSeconds" type="number" value={form.durationSeconds} onChange={onChange} />
      <input name="sellerId" value={form.sellerId} onChange={onChange} />
      <button onClick={create}>Create</button>
      {created && <pre>{JSON.stringify(created, null, 2)}</pre>}
    </div>
  )
}
