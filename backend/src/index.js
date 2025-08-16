import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './db.js';
import { initSocket } from './services/socket.js';
import { notFound, errorHandler } from './middleware/error.js';

// Models
// import './models/User.js';
import './models/User.js';
import './models/Auction.js';
import './models/Bid.js';
import './models/CounterOffer.js';
import './models/Notification.js';

// Routes
import { auctions } from './routes/auctions.js';
import { bids } from './routes/bids.js';
import { seller } from './routes/seller.js';
import { notifications } from './routes/notifications.js';
import { users } from './routes/users.js';

// Env vars
const PORT = process.env.PORT || 8080;
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
const DATABASE_URL = process.env.DATABASE_URL;

console.log('=== Environment Check ===');
console.log('PORT:', PORT);
console.log('ORIGIN:', ORIGIN);
console.log('DATABASE_URL set:', !!DATABASE_URL);
console.log('REDIS URL set:', !!process.env.UPSTASH_REDIS_URL);
console.log('REDIS TOKEN set:', !!process.env.UPSTASH_REDIS_TOKEN);
console.log('SENDGRID key set:', !!process.env.SENDGRID_API_KEY);
console.log('=========================');

const app = express();

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  process.env.RENDER_EXTERNAL_URL // Render sets this to your service URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// API routes
app.use('/api/auctions', auctions);
app.use('/api/bids', bids);
app.use('/api/seller', seller);
app.use('/api/notifications', notifications);
app.use('/api/users', users);

// Static frontend (for production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
}
// now lets try

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server + sockets
const server = http.createServer(app);
initSocket(server);

// Start function
async function start() {
  try {
    if (!DATABASE_URL) {
      console.warn('⚠ DATABASE_URL not set — starting without DB connection.');
      server.listen(PORT, () => console.log(`Server running on :${PORT} (NO DB)`));
      return;
    }
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync();
    server.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (e) {
    console.error('❌ Failed to connect to DB', e.message);
    console.error('Starting server without DB connection...');
    server.listen(PORT, () => console.log(`Server running on :${PORT} (NO DB)`));
  }
}

start();
