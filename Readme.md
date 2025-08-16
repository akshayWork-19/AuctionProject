# Mini Auction Platform

- A full-stack web application where users can create auctions, place bids in real-time, and manage sales/purchases. Built with Node.js, Express, PostgreSQL, Sequelize, React, Socket.IO, Docker and deployed on Render.

# 🚀 Live Demo

- 🔗 Frontend + Backend (Render): https://auctionproject-ekca.onrender.com

# 📂 Project Structure

```
root/
 ├── backend/       # Express API, DB models, Socket.IO, services
 ├── frontend/      # React (Vite) frontend
 ├── Dockerfile     # Multi-stage build for frontend + backend
 └── .gitignore
 └── .dockerignore
 └── Readme.md
```

# Features

- 👤 User Management – Register, login, manage profiles

- 🛒 Auction Creation – Sellers can create auctions with details

- 💸 Bidding System – Buyers place bids in real-time (Socket.IO)

- 📢 Notifications – Real-time bid updates & seller decisions

- 🧾 Invoices – Auto-generated PDF invoice for completed sales

- 🌐 Deployment – Containerized with Docker and hosted on Render

# 🛠️ Tech Stack

## Frontend:

- React 18 + Vite

- React Router

- Axios

- Socket.IO client

## Backend:

- Node.js + Express

- Sequelize ORM + PostgreSQL

- Socket.IO

- SendGrid (emails)

- Upstash Redis (notifications)

- PDFKit (invoices)

## DevOps:

- Docker (multi-stage build: frontend + backend)

- Render (hosting + managed Postgres)

# 📝 API Endpoints

- POST /api/users/register – Create user

- POST /api/users/login – Login

- POST /api/auctions – Create auction

- GET /api/auctions – Get all auctions

- POST /api/bids/:auctionId – Place bid

- POST /api/seller/:auctionId/decision – Accept/reject bids

# 🎯 Future Improvements

- JWT authentication & refresh tokens

- Seller dashboards

- Payment gateway integration

- Auction expiration timers

# 👨‍💻 Author

Developed by Akshay kumar as part of assignment submission.
