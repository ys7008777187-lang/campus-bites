import { Router } from 'express';
import { db } from '../db/database.js';

export default function orderRoutes(broadcast) {
    const router = Router();

    // POST /api/orders
    router.post('/', (req, res) => {
        const { storeId, items, paymentMethod, customerName } = req.body;
        if (!storeId || !items || !items.length) {
            return res.status(400).json({ error: 'storeId and items required' });
        }

        const store = db.getStore(storeId);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        if (!store.isOpen) return res.status(400).json({ error: 'Store is currently closed' });

        const total = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
        const maxPrep = Math.max(...items.map(it => it.prepTime || 10));
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
        const now = new Date().toISOString();
        const estimatedReady = new Date(Date.now() + maxPrep * 60000).toISOString();

        const order = {
            id: orderId,
            userId: req.user?.id || null,
            storeId,
            storeName: store.name,
            customerName: customerName || req.user?.name || 'Student',
            items,
            total,
            status: 'new',
            paymentMethod: paymentMethod || 'upi',
            otp,
            placedAt: now,
            estimatedReady,
            completedAt: null,
            rejectedReason: null,
        };

        db.addOrder(order);
        broadcast({ type: 'NEW_ORDER', storeId, order });
        res.status(201).json(order);
    });

    // GET /api/orders?userId=X or ?storeId=X or ?all=true
    router.get('/', (req, res) => {
        const { userId, storeId, all, status, limit } = req.query;
        let orders;

        if (all === 'true') {
            orders = db.getAllOrders();
            if (storeId) orders = orders.filter(o => o.storeId === storeId);
            if (status) orders = orders.filter(o => o.status === status);
            orders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
            if (limit) orders = orders.slice(0, parseInt(limit));
        } else if (userId) {
            orders = db.getOrdersByUser(userId);
        } else if (storeId) {
            orders = db.getOrdersByStore(storeId);
        } else {
            orders = db.getAllOrders().sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)).slice(0, 50);
        }

        res.json(orders);
    });

    // GET /api/orders/:id
    router.get('/:id', (req, res) => {
        const order = db.getOrder(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    });

    // PUT /api/orders/:id/status
    router.put('/:id/status', (req, res) => {
        const { status, reason, otp } = req.body;
        const order = db.getOrder(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const validTransitions = {
            'new': ['preparing', 'rejected'],
            'preparing': ['ready'],
            'ready': ['completed'],
        };

        const allowed = validTransitions[order.status];
        if (!allowed || !allowed.includes(status)) {
            return res.status(400).json({ error: `Cannot transition from '${order.status}' to '${status}'` });
        }

        if (status === 'completed' && otp && otp !== order.otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const changes = { status };
        if (status === 'preparing') changes.estimatedReady = new Date(Date.now() + 15 * 60000).toISOString();
        if (status === 'completed') changes.completedAt = new Date().toISOString();
        if (status === 'rejected') changes.rejectedReason = reason || 'Rejected by store';

        const updated = db.updateOrder(req.params.id, changes);

        broadcast({
            type: 'ORDER_STATUS_UPDATE',
            orderId: req.params.id,
            storeId: order.storeId,
            status,
            order: updated,
        });

        res.json(updated);
    });

    return router;
}
