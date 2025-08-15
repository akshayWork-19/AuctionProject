import { io } from 'socket.io-client'
export const SOCKET_ORIGIN = import.meta.env.VITE_SOCKET_ORIGIN || 'http://localhost:8080'
export const socket = io(SOCKET_ORIGIN, {
  autoConnect: true,
  transports: ['websocket'],
})
