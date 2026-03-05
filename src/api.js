// Campus Bites API Client — Student App
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// ---- HTTP helpers ----

function getHeaders() {
    const token = localStorage.getItem('cb_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: getHeaders(),
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

// ---- Auth ----

export async function loginWithPhone(phone) {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone }),
    });
}

export async function verifyOTP(phone, otp) {
    const data = await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
    });
    if (data.token) localStorage.setItem('cb_token', data.token);
    return data;
}

// ---- Food Courts ----

export async function fetchFoodCourts() {
    return request('/foodcourts');
}

export async function fetchFoodCourt(id) {
    return request(`/foodcourts/${id}`);
}

// ---- Stores ----

export async function fetchStores(courtId) {
    const q = courtId ? `?courtId=${courtId}` : '';
    return request(`/stores${q}`);
}

export async function fetchStore(id) {
    return request(`/stores/${id}`);
}

export async function fetchMenu(storeId) {
    return request(`/stores/${storeId}/menu`);
}

// ---- Orders ----

export async function placeOrder({ storeId, items, paymentMethod, customerName }) {
    return request('/orders', {
        method: 'POST',
        body: JSON.stringify({ storeId, items, paymentMethod, customerName }),
    });
}

export async function fetchOrders(userId) {
    const q = userId ? `?userId=${userId}` : '';
    return request(`/orders${q}`);
}

export async function fetchOrder(id) {
    return request(`/orders/${id}`);
}

// ---- WebSocket ----

let ws = null;
let listeners = new Set();

export function connectWebSocket() {
    if (ws && ws.readyState <= 1) return; // already open or connecting
    ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            for (const fn of listeners) fn(data);
        } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
        // Auto-reconnect after 2s
        setTimeout(connectWebSocket, 2000);
    };

    ws.onerror = () => { ws.close(); };
}

export function onWSMessage(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

export function disconnectWebSocket() {
    if (ws) { ws.close(); ws = null; }
    listeners.clear();
}
