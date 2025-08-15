import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { socket } from '../lib/socket'

const DEMO_USER = '00000000-0000-0000-0000-000000000002'

export default function Notifications() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get(`/notifications/${DEMO_USER}`).then(r => setItems(r.data))
    socket.on('notification', notif => {
      if (notif.userId === DEMO_USER) setItems(curr => [notif, ...curr])
    })
    return () => socket.off('notification')
  }, [])

  return (
    <div>
      <h3>Notifications</h3>
      {items.map(n => <div key={n.id}>{n.message}</div>)}
    </div>
  )
}
