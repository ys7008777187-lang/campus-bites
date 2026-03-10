import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'campus_bites.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

// Open SQLite database (creates file if it doesn't exist)
const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Run schema to create tables if they don't exist
const schema = readFileSync(SCHEMA_PATH, 'utf-8');
sqlite.exec(schema);

// ─── Helpers ──────────────────────────────────────────────
// Convert snake_case DB row to camelCase JS object
function toCamel(row) {
    if (!row) return null;
    const out = {};
    for (const [k, v] of Object.entries(row)) {
        const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        out[camel] = v;
    }
    // Convert SQLite integers to booleans for known boolean fields
    if ('isOpen' in out) out.isOpen = !!out.isOpen;
    if ('isVeg' in out) out.isVeg = !!out.isVeg;
    if ('isAvailable' in out) out.isAvailable = !!out.isAvailable;
    // Alias: password_hash → password (routes use user.password)
    if ('passwordHash' in out) { out.password = out.passwordHash; delete out.passwordHash; }
    return out;
}

function toCamelArray(rows) {
    return rows.map(toCamel);
}

// Convert camelCase JS keys to snake_case for SQL
function toSnakeKey(key) {
    return key.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

// ─── Check if DB is seeded ────────────────────────────────
export function isSeeded() {
    try {
        const row = sqlite.prepare('SELECT COUNT(*) as count FROM food_courts').get();
        return row && row.count > 0;
    } catch (e) {
        // If table doesn't exist, it's definitely not seeded
        return false;
    }
}

// For backward compat — not used with SQLite but kept for seed.js
export function getDB() { return null; }
export function saveDB() { /* no-op for SQLite */ }

// ─── Database API (same surface as before) ────────────────
export const db = {

    // ── Food Courts ──
    getAllFoodCourts() {
        return toCamelArray(sqlite.prepare('SELECT * FROM food_courts').all());
    },

    getFoodCourt(id) {
        return toCamel(sqlite.prepare('SELECT * FROM food_courts WHERE id = ?').get(id));
    },

    addFoodCourt(court) {
        sqlite.prepare(`INSERT INTO food_courts (id, name, image, description, is_open, open_time, close_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
            court.id, court.name, court.image || '🏫', court.description || '',
            court.isOpen !== false ? 1 : 0, court.openTime || '8:00 AM', court.closeTime || '9:00 PM'
        );
    },

    updateFoodCourt(id, changes) {
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(changes)) {
            const col = toSnakeKey(k);
            sets.push(`${col} = ?`);
            vals.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
        }
        if (sets.length > 0) {
            vals.push(id);
            sqlite.prepare(`UPDATE food_courts SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
        }
        return this.getFoodCourt(id);
    },

    // ── Stores ──
    getAllStores() {
        return toCamelArray(sqlite.prepare('SELECT * FROM stores').all());
    },

    getStore(id) {
        return toCamel(sqlite.prepare('SELECT * FROM stores WHERE id = ?').get(id));
    },

    getStoresByCourt(courtId) {
        return toCamelArray(sqlite.prepare('SELECT * FROM stores WHERE court_id = ?').all(courtId));
    },

    addStore(store) {
        sqlite.prepare(`INSERT INTO stores (id, court_id, name, image, cuisine, description, rating, total_reviews, prep_time, is_open, owner_name, owner_avatar, phone, upi_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            store.id, store.courtId, store.name, store.image || '🍽️',
            store.cuisine || '', store.description || '',
            store.rating || 0, store.totalReviews || 0,
            store.prepTime || '10-15 min', store.isOpen ? 1 : 0,
            store.ownerName || '', store.ownerAvatar || '👨‍🍳',
            store.phone || '', store.upiId || ''
        );
    },

    updateStore(id, changes) {
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(changes)) {
            const col = toSnakeKey(k);
            sets.push(`${col} = ?`);
            vals.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
        }
        if (sets.length > 0) {
            vals.push(id);
            sqlite.prepare(`UPDATE stores SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
        }
        return this.getStore(id);
    },

    removeStore(id) {
        sqlite.prepare('DELETE FROM menu_items WHERE store_id = ?').run(id);
        sqlite.prepare('DELETE FROM orders WHERE store_id = ?').run(id);
        sqlite.prepare('DELETE FROM stores WHERE id = ?').run(id);
    },

    // ── Users ──
    getUserByUsername(username) {
        return toCamel(sqlite.prepare('SELECT * FROM users WHERE username = ?').get(username));
    },

    getUserByPhone(phone) {
        return toCamel(sqlite.prepare('SELECT * FROM users WHERE phone = ?').get(phone));
    },

    getUserById(id) {
        return toCamel(sqlite.prepare('SELECT * FROM users WHERE id = ?').get(id));
    },

    getUserByStoreId(storeId) {
        return toCamel(sqlite.prepare('SELECT * FROM users WHERE store_id = ? LIMIT 1').get(storeId));
    },

    addUser(user) {
        sqlite.prepare(`INSERT INTO users (id, phone, username, password_hash, role, name, avatar, store_id, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            user.id, user.phone || null, user.username || null,
            user.password || null, user.role || 'student',
            user.name || '', user.avatar || '👤',
            user.storeId || null, user.email || null
        );
    },

    updateUser(id, changes) {
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(changes)) {
            // Special mapping: password → password_hash
            const col = k === 'password' ? 'password_hash' : toSnakeKey(k);
            sets.push(`${col} = ?`);
            vals.push(v);
        }
        if (sets.length > 0) {
            vals.push(id);
            sqlite.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
        }
        return this.getUserById(id);
    },

    // ── Menu Items ──
    getMenuByStore(storeId) {
        return toCamelArray(sqlite.prepare('SELECT * FROM menu_items WHERE store_id = ?').all(storeId));
    },

    getMenuItem(id) {
        return toCamel(sqlite.prepare('SELECT * FROM menu_items WHERE id = ?').get(id));
    },

    addMenuItem(item) {
        sqlite.prepare(`INSERT INTO menu_items (id, store_id, name, category, price, prep_time, is_veg, image, description, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            item.id, item.storeId, item.name, item.category || '',
            item.price, item.prepTime || 10,
            item.isVeg !== false ? 1 : 0, item.image || '🍽️',
            item.description || '', item.isAvailable !== false ? 1 : 0
        );
        return this.getMenuItem(item.id);
    },

    updateMenuItem(id, changes) {
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(changes)) {
            const col = toSnakeKey(k);
            sets.push(`${col} = ?`);
            vals.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
        }
        if (sets.length > 0) {
            vals.push(id);
            sqlite.prepare(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
        }
        return this.getMenuItem(id);
    },

    removeMenuItem(id) {
        sqlite.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    },

    // ── Orders ──
    // Orders store items as JSON string in items_json column
    _rowToOrder(row) {
        if (!row) return null;
        const o = toCamel(row);
        // Parse items_json back to array
        try { o.items = JSON.parse(o.itemsJson || '[]'); } catch { o.items = []; }
        delete o.itemsJson;
        return o;
    },

    getAllOrders() {
        return sqlite.prepare('SELECT * FROM orders ORDER BY placed_at DESC').all().map(r => this._rowToOrder(r));
    },

    getOrder(id) {
        return this._rowToOrder(sqlite.prepare('SELECT * FROM orders WHERE id = ?').get(id));
    },

    getOrdersByUser(userId) {
        return sqlite.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY placed_at DESC').all(userId).map(r => this._rowToOrder(r));
    },

    getOrdersByStore(storeId) {
        return sqlite.prepare('SELECT * FROM orders WHERE store_id = ? ORDER BY placed_at DESC').all(storeId).map(r => this._rowToOrder(r));
    },

    addOrder(order) {
        sqlite.prepare(`INSERT INTO orders (id, user_id, store_id, store_name, customer_name, items_json, total, status, payment_method, otp, placed_at, estimated_ready, completed_at, rejected_reason)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            order.id, order.userId || null, order.storeId,
            order.storeName || '', order.customerName || 'Student',
            JSON.stringify(order.items || []), order.total,
            order.status || 'new', order.paymentMethod || 'upi',
            order.otp || '', order.placedAt || new Date().toISOString(),
            order.estimatedReady || null, order.completedAt || null,
            order.rejectedReason || null
        );
    },

    updateOrder(id, changes) {
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(changes)) {
            if (k === 'items') {
                sets.push('items_json = ?');
                vals.push(JSON.stringify(v));
            } else {
                const col = toSnakeKey(k);
                sets.push(`${col} = ?`);
                vals.push(v);
            }
        }
        if (sets.length > 0) {
            vals.push(id);
            sqlite.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
        }
        return this.getOrder(id);
    },

    // ── Platform Config (key-value table) ──
    getConfig(key) {
        const row = sqlite.prepare('SELECT value FROM platform_config WHERE key = ?').get(key);
        if (!row) return undefined;
        try { return JSON.parse(row.value); } catch { return row.value; }
    },

    setConfig(key, value) {
        const val = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
        sqlite.prepare(`INSERT OR REPLACE INTO platform_config (key, value) VALUES (?, ?)`).run(key, val);
    },

    // ── Fee Settlements ──
    getSettlements(storeId) {
        return toCamelArray(sqlite.prepare('SELECT * FROM fee_settlements WHERE store_id = ?').all(storeId));
    },

    addSettlement(settlement) {
        sqlite.prepare(`INSERT INTO fee_settlements (id, store_id, amount, status, period_start, period_end, settled_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
            settlement.id, settlement.storeId, settlement.amount,
            settlement.status || 'pending',
            settlement.periodStart || null, settlement.periodEnd || null,
            settlement.settledAt || null
        );
    },

    // ── Credential Requests ──
    addCredentialRequest(req) {
        sqlite.prepare(`INSERT INTO credential_requests (id, store_name, owner_name, email, phone, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`).run(
            req.id, req.storeName, req.ownerName || '', req.email || '', req.phone || '',
            req.message || '', req.createdAt || new Date().toISOString()
        );
    },

    getAllCredentialRequests() {
        return toCamelArray(sqlite.prepare('SELECT * FROM credential_requests ORDER BY created_at DESC').all());
    },

    getCredentialRequest(id) {
        return toCamel(sqlite.prepare('SELECT * FROM credential_requests WHERE id = ?').get(id));
    },

    updateCredentialRequest(id, changes) {
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(changes)) {
            const col = toSnakeKey(k);
            sets.push(`${col} = ?`);
            vals.push(v);
        }
        if (sets.length > 0) {
            vals.push(id);
            sqlite.prepare(`UPDATE credential_requests SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
        }
        return this.getCredentialRequest(id);
    },

    // ── Save (no-op for SQLite, kept for compat) ──
    save() { /* SQLite auto-commits */ },
};
