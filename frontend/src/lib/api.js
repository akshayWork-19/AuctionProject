import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_BASE,
})
