import { Router } from 'express';
import { db } from '../db/database.js';

export default function adminRoutes(broadcast) {
    const router = Router();

    // ========== DASHBOARD ==========
    router.get('/dashboard', (req, res) => {
        const stores = db.getAllStores();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const allOrders = db.getAllOrders();
        const todayOrders = allOrders.filter(o => o.placedAt >= todayStart);
        const completedToday = todayOrders.filter(o => o.status === 'completed');
        const feePerOrder = db.getConfig('fee_per_order') || 2;

        // Fees by day (last 7 days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const platformFeesByDay = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now - i * 86400000);
            const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
            const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
            const dayCompleted = allOrders.filter(o => o.status === 'completed' && o.placedAt >= dayStart && o.placedAt < dayEnd);
            platformFeesByDay.push({ day: days[d.getDay()], orders: dayCompleted.length, fees: dayCompleted.length * feePerOrder });
        }

        res.json({
            totalStores: stores.length,
            activeStores: stores.filter(s => s.isOpen).length,
            todayOrders: todayOrders.length,
            todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
            feesEarnedToday: completedToday.length * feePerOrder,
            feePerOrder,
            platformFeesByDay,
            stores: stores.map(s => ({
                id: s.id, name: s.name, image: s.image, cuisine: s.cuisine, isOpen: s.isOpen,
                todayOrders: allOrders.filter(o => o.storeId === s.id && o.placedAt >= todayStart).length,
            })),
        });
    });

    // ========== STORES ==========
    router.get('/stores', (req, res) => {
        const stores = db.getAllStores();
        const allOrders = db.getAllOrders();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now - 7 * 86400000).toISOString();
        const monthAgo = new Date(now - 30 * 86400000).toISOString();

        res.json(stores.map(s => {
            const storeOrders = allOrders.filter(o => o.storeId === s.id);
            const today = storeOrders.filter(o => o.placedAt >= todayStart);
            const week = storeOrders.filter(o => o.placedAt >= weekAgo);
            const month = storeOrders.filter(o => o.placedAt >= monthAgo);
            return {
                ...s,
                todayOrders: today.length, todayRevenue: today.reduce((s2, o) => s2 + o.total, 0),
                weekOrders: week.length, weekRevenue: week.reduce((s2, o) => s2 + o.total, 0),
                monthOrders: month.length, monthRevenue: month.reduce((s2, o) => s2 + o.total, 0),
            };
        }));
    });

    router.post('/stores', (req, res) => {
        const { name, cuisine, image, imageUrl, courtId, ownerName, phone, upiId } = req.body;
        if (!name || !courtId) return res.status(400).json({ error: 'Name and courtId required' });

        const storeId = 's' + Date.now();
        const store = {
            id: storeId, courtId, name, image: image || '🍽️', imageUrl: imageUrl || '',
            cuisine: cuisine || '',
            rating: 0, totalReviews: 0, prepTime: '10-15 min', isOpen: true,
            ownerName: ownerName || '', ownerAvatar: '👨‍🍳', phone: phone || '', upiId: upiId || '',
        };
        db.addStore(store);

        // Auto-generate store owner credentials
        const username = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
        const password = 'store123';
        const userId = `u-store-${storeId}`;

        // Ensure username is unique — append number if needed
        let finalUsername = username;
        let suffix = 1;
        while (db.getUserByUsername(finalUsername)) {
            finalUsername = `${username}${suffix}`;
            suffix++;
        }

        const user = {
            id: userId, username: finalUsername, password,
            role: 'store_owner', name: ownerName || name,
            avatar: '👨‍🍳', storeId, email: null,
        };
        db.addUser(user);

        broadcast({ type: 'STORE_ADDED', store });
        res.status(201).json({
            store,
            credentials: { username: finalUsername, password },
        });
    });

    router.put('/stores/:id', (req, res) => {
        const store = db.getStore(req.params.id);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        const updated = db.updateStore(req.params.id, req.body);
        res.json(updated);
    });

    router.put('/stores/:id/toggle', (req, res) => {
        const store = db.getStore(req.params.id);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        const updated = db.updateStore(req.params.id, { isOpen: !store.isOpen });
        broadcast({ type: 'STORE_STATUS_CHANGE', storeId: store.id, storeName: store.name, isOpen: !store.isOpen });
        res.json({ id: store.id, name: store.name, isOpen: !store.isOpen });
    });

    router.delete('/stores/:id', (req, res) => {
        const store = db.getStore(req.params.id);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        db.removeStore(req.params.id);
        broadcast({ type: 'STORE_REMOVED', storeId: req.params.id });
        res.json({ message: `Store '${store.name}' removed` });
    });

    // ========== ORDERS ==========
    router.get('/orders', (req, res) => {
        const { storeId, status, limit } = req.query;
        let orders = db.getAllOrders();
        if (storeId) orders = orders.filter(o => o.storeId === storeId);
        if (status) orders = orders.filter(o => o.status === status);
        orders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
        if (limit) orders = orders.slice(0, parseInt(limit));

        const feePerOrder = db.getConfig('fee_per_order') || 2;
        const completedCount = orders.filter(o => o.status === 'completed').length;

        res.json({
            orders,
            summary: {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((s, o) => s + o.total, 0),
                completedCount,
                totalFees: completedCount * feePerOrder,
                feePerOrder,
            },
        });
    });

    // ========== FEES ==========
    router.get('/fees', (req, res) => {
        const stores = db.getAllStores();
        const feePerOrder = db.getConfig('fee_per_order') || 2;
        const allOrders = db.getAllOrders();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now - 7 * 86400000).toISOString();
        const monthAgo = new Date(now - 30 * 86400000).toISOString();

        const completedAll = allOrders.filter(o => o.status === 'completed');
        const todayCompleted = completedAll.filter(o => o.placedAt >= todayStart).length;
        const weekCompleted = completedAll.filter(o => o.placedAt >= weekAgo).length;
        const monthCompleted = completedAll.filter(o => o.placedAt >= monthAgo).length;

        const storeFees = stores.map(s => {
            const completed = completedAll.filter(o => o.storeId === s.id).length;
            const totalFees = completed * feePerOrder;
            const settlements = db.getSettlements(s.id);
            const settled = settlements.filter(f => f.status === 'settled').reduce((sum, f) => sum + f.amount, 0);
            return { storeId: s.id, storeName: s.name, completedOrders: completed, totalFees, settled, pending: totalFees - settled };
        });

        res.json({
            feePerOrder,
            summary: { totalFeesToday: todayCompleted * feePerOrder, totalOrdersToday: todayCompleted, totalFeesWeek: weekCompleted * feePerOrder, totalFeesMonth: monthCompleted * feePerOrder },
            storeFees,
        });
    });

    router.put('/fees/config', (req, res) => {
        const { feePerOrder } = req.body;
        if (feePerOrder === undefined || feePerOrder < 0) return res.status(400).json({ error: 'Valid feePerOrder required' });
        db.setConfig('fee_per_order', feePerOrder);
        res.json({ feePerOrder, message: 'Fee updated' });
    });

    router.put('/fees/:storeId/settle', (req, res) => {
        const store = db.getStore(req.params.storeId);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        const feePerOrder = db.getConfig('fee_per_order') || 2;
        const completed = db.getAllOrders().filter(o => o.storeId === req.params.storeId && o.status === 'completed').length;
        const totalFees = completed * feePerOrder;
        const settled = db.getSettlements(req.params.storeId).filter(f => f.status === 'settled').reduce((s, f) => s + f.amount, 0);
        const pending = totalFees - settled;
        if (pending <= 0) return res.json({ message: 'No pending fees', pending: 0 });

        db.addSettlement({ id: 'SET-' + Date.now().toString(36), storeId: req.params.storeId, amount: pending, status: 'settled', settledAt: new Date().toISOString() });
        res.json({ message: `₹${pending} settled for ${store.name}`, amount: pending });
    });

    // ========== ANALYTICS ==========
    router.get('/analytics', (req, res) => {
        const now = new Date();
        const allOrders = db.getAllOrders();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const revenueByDay = [], ordersByDay = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now - i * 86400000);
            const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
            const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
            const dayOrders = allOrders.filter(o => o.placedAt >= dayStart && o.placedAt < dayEnd);
            revenueByDay.push({ day: days[d.getDay()], revenue: dayOrders.reduce((s, o) => s + o.total, 0) });
            ordersByDay.push({ day: days[d.getDay()], orders: dayOrders.length });
        }
        const completed = allOrders.filter(o => o.status === 'completed');
        const itemCounts = {};
        for (const o of completed) {
            for (const it of o.items) {
                if (!itemCounts[it.name]) itemCounts[it.name] = { orders: 0, revenue: 0 };
                itemCounts[it.name].orders += it.qty;
                itemCounts[it.name].revenue += it.price * it.qty;
            }
        }
        const popularItems = Object.entries(itemCounts).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.orders - a.orders).slice(0, 10);
        res.json({ revenueByDay, ordersByDay, popularItems });
    });

    // ========== FOOD COURTS ==========
    router.get('/foodcourts', (req, res) => {
        res.json(db.getAllFoodCourts().map(c => ({ ...c, storeCount: db.getStoresByCourt(c.id).length })));
    });

    router.post('/foodcourts', (req, res) => {
        const { name, image, description, openTime, closeTime } = req.body;
        if (!name) return res.status(400).json({ error: 'Name required' });
        const court = { id: 'fc' + Date.now(), name, image: image || '🏫', description: description || '', isOpen: true, openTime: openTime || '8:00 AM', closeTime: closeTime || '9:00 PM' };
        db.addFoodCourt(court);
        broadcast({ type: 'FOODCOURT_ADDED', foodCourt: court });
        res.status(201).json(court);
    });

    router.put('/foodcourts/:id', (req, res) => {
        const court = db.getFoodCourt(req.params.id);
        if (!court) return res.status(404).json({ error: 'Food court not found' });
        db.updateFoodCourt(req.params.id, req.body);
        res.json({ id: req.params.id, message: 'Updated' });
    });

    // ========== ADMIN PROFILE ==========
    router.put('/profile', (req, res) => {
        const { name, email, password } = req.body;
        const changes = {};
        if (name) changes.name = name;
        if (email) changes.email = email;
        if (password) changes.password = password;
        const user = db.updateUser(req.user.id, changes);
        res.json({ id: user.id, name: user.name, email: user.email, message: 'Profile updated' });
    });

    // ========== CREDENTIAL REQUESTS ==========
    router.get('/credential-requests', (req, res) => {
        res.json(db.getAllCredentialRequests());
    });

    router.put('/credential-requests/:id/resolve', (req, res) => {
        const cr = db.getCredentialRequest(req.params.id);
        if (!cr) return res.status(404).json({ error: 'Request not found' });

        // Find matching store by name
        const stores = db.getAllStores();
        const store = stores.find(s => s.name.toLowerCase() === cr.storeName.toLowerCase());

        if (!store) {
            db.updateCredentialRequest(req.params.id, {
                status: 'rejected',
                adminResponse: `No store found with name "${cr.storeName}"`,
                resolvedAt: new Date().toISOString(),
            });
            return res.json({ message: `No store found matching "${cr.storeName}"`, status: 'rejected' });
        }

        // Generate new credentials
        let username = store.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
        const newPassword = 'store' + Math.floor(1000 + Math.random() * 9000);

        // Find existing store owner user
        const existingUser = db.getUserByStoreId(store.id);

        if (existingUser) {
            username = existingUser.username;
            db.updateUser(existingUser.id, { password: newPassword });
        } else {
            let finalUsername = username;
            let suffix = 1;
            while (db.getUserByUsername(finalUsername)) {
                finalUsername = `${username}${suffix}`;
                suffix++;
            }
            username = finalUsername;
            db.addUser({
                id: `u-store-${store.id}-${Date.now()}`,
                username,
                password: newPassword,
                role: 'store_owner',
                name: store.ownerName || store.name,
                avatar: '👨‍🍳',
                storeId: store.id,
                email: null,
            });
        }

        db.updateCredentialRequest(req.params.id, {
            status: 'resolved',
            newUsername: username,
            newPassword: newPassword,
            adminResponse: `New credentials generated for ${store.name}`,
            resolvedAt: new Date().toISOString(),
        });

        res.json({
            message: `Credentials regenerated for ${store.name}`,
            credentials: { username, password: newPassword },
            status: 'resolved',
        });
    });

    return router;
}
