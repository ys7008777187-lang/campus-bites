import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { seedDatabase } from './db/seed.js';
import { authMiddleware, requireRole } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import foodcourtRouter from './routes/foodcourts.js';
import storeRouter from './routes/stores.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const PORT = process.env.PORT || 3001;

// Seed database on startup
seedDatabase();

// Express app
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket setup
const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`🔗 WebSocket connected (${clients.size} clients)`);
    ws.on('close', () => { clients.delete(ws); });
    ws.on('error', () => { clients.delete(ws); });
});

function broadcast(data) {
    const msg = JSON.stringify(data);
    for (const ws of clients) {
        if (ws.readyState === 1) ws.send(msg);
    }
}

// ---- Routes ----

// Public
app.use('/api/auth', authRouter);
app.use('/api/foodcourts', foodcourtRouter);
app.use('/api/stores', storeRouter);

// Orders (optional auth)
app.use('/api/orders', (req, res, next) => {
    const h = req.headers.authorization;
    if (h && h.startsWith('Bearer ')) {
        authMiddleware(req, res, next);
    } else {
        req.user = null;
        next();
    }
}, orderRoutes(broadcast));

// Admin (protected)
app.use('/api/admin', authMiddleware, requireRole('super_admin'), adminRoutes(broadcast));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'Campus Bites API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: '/api/auth',
            foodcourts: '/api/foodcourts',
            stores: '/api/stores',
            orders: '/api/orders',
            admin: '/api/admin',
            health: '/api/health',
        },
    });
});

// Handle Chrome DevTools well-known requests
app.get('/.well-known/*', (req, res) => {
    res.status(204).end();
});

// Catch-all 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

// Start
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║    🍕 Campus Bites API Server             ║
║    http://localhost:${PORT}                 ║
║    WebSocket: ws://localhost:${PORT}        ║
╚═══════════════════════════════════════════╝`);
});
