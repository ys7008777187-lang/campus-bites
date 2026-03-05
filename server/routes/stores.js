import { Router } from 'express';
import { db } from '../db/database.js';

const router = Router();

// GET /api/stores?courtId=X
router.get('/', (req, res) => {
    const { courtId } = req.query;
    const stores = courtId ? db.getStoresByCourt(courtId) : db.getAllStores();
    res.json(stores);
});

// GET /api/stores/:id
router.get('/:id', (req, res) => {
    const store = db.getStore(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
});

// PUT /api/stores/:id
router.put('/:id', (req, res) => {
    const store = db.getStore(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    const updated = db.updateStore(req.params.id, req.body);
    res.json(updated);
});

// GET /api/stores/:id/menu
router.get('/:id/menu', (req, res) => {
    const items = db.getMenuByStore(req.params.id);
    res.json(items);
});

// POST /api/stores/:id/menu
router.post('/:id/menu', (req, res) => {
    const { name, category, price, prepTime, isVeg, image, description } = req.body;
    const item = {
        id: 'm' + Date.now(),
        storeId: req.params.id,
        name, category, price,
        prepTime: prepTime || 10,
        isVeg: isVeg !== false,
        image: image || '🍽️',
        description: description || '',
        isAvailable: true,
    };
    db.addMenuItem(item);
    res.status(201).json(item);
});

// PUT /api/stores/:id/menu/:itemId
router.put('/:id/menu/:itemId', (req, res) => {
    const item = db.getMenuItem(req.params.itemId);
    if (!item || item.storeId !== req.params.id) return res.status(404).json({ error: 'Menu item not found' });
    const updated = db.updateMenuItem(req.params.itemId, req.body);
    res.json(updated);
});

// DELETE /api/stores/:id/menu/:itemId
router.delete('/:id/menu/:itemId', (req, res) => {
    const item = db.getMenuItem(req.params.itemId);
    if (!item || item.storeId !== req.params.id) return res.status(404).json({ error: 'Menu item not found' });
    db.removeMenuItem(req.params.itemId);
    res.json({ message: 'Deleted' });
});

// GET /api/stores/:id/analytics
router.get('/:id/analytics', (req, res) => {
    const storeId = req.params.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now - 7 * 86400000).toISOString();
    const monthAgo = new Date(now - 30 * 86400000).toISOString();

    const allOrders = db.getOrdersByStore(storeId);
    const todayOrders = allOrders.filter(o => o.placedAt >= todayStart);
    const weekOrders = allOrders.filter(o => o.placedAt >= weekAgo);
    const monthOrders = allOrders.filter(o => o.placedAt >= monthAgo);
    const store = db.getStore(storeId);

    const menuItems = db.getMenuByStore(storeId);
    const avgPrepTime = menuItems.length > 0
        ? Math.round(menuItems.reduce((s, m) => s + (m.prepTime || 10), 0) / menuItems.length)
        : 10;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay = days.map(day => {
        const dayOrders = weekOrders.filter(o => days[new Date(o.placedAt).getDay()] === day);
        return { day, revenue: dayOrders.reduce((s, o) => s + o.total, 0) };
    });

    res.json({
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
        weekOrders: weekOrders.length,
        weekRevenue: weekOrders.reduce((s, o) => s + o.total, 0),
        monthOrders: monthOrders.length,
        monthRevenue: monthOrders.reduce((s, o) => s + o.total, 0),
        avgPrepTime,
        rating: store?.rating || 0,
        totalReviews: store?.totalReviews || 0,
        revenueByDay,
    });
});

// GET /api/stores/:id/payments
router.get('/:id/payments', (req, res) => {
    const orders = db.getOrdersByStore(req.params.id).filter(o => o.status === 'completed').slice(0, 50);
    res.json(orders.map(o => ({
        id: o.id, amount: o.total, method: o.paymentMethod, status: 'settled', date: o.completedAt,
    })));
});

export default router;
