import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT, ORIGIN } from './config.js';
import { sequelize } from './db.js';
import { initSocket } from './services/socket.js';
import { notFound, errorHandler } from './middleware/error.js';

// Models import to register with Sequelize (side-effect import)
import './models/User.js';
import './models/Auction.js';
import './models/Bid.js'
import './models/CounterOffer.js';
import './models/Notification.js';

import { auctions } from './routes/auctions.js';
import { bids } from './routes/bids.js';
import { seller } from './routes/seller.js';
import { notifications } from './routes/notifications.js';
import { users } from './routes/users.js';

const app = express();
// app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8000'],
  credentials: true
}))
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auctions', auctions);
app.use('/api/bids', bids);
app.use('/api/seller', seller);
app.use('/api/notifications', notifications);
app.use('/api/users', users);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
initSocket(server);

// Serve built frontend if exists (backend/public)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public'); // ✅ works in Docker
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}



async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync(); // in dev; for prod, use migrations
    server.listen(PORT, () => console.log(`Server listening on :${PORT}`));
  } catch (e) {
    console.error('Failed to start', e);
    process.exit(1);
  }
}

start();
