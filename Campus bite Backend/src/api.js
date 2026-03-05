// Campus Bites Dashboard API Client
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

function getToken() { return localStorage.getItem('cb_dash_token'); }
function setToken(t) { localStorage.setItem('cb_dash_token', t); }
export function clearToken() { localStorage.removeItem('cb_dash_token'); }

function headers() {
    const h = { 'Content-Type': 'application/json' };
    const t = getToken();
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
}

async function req(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, { headers: headers(), ...opts });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

// ---- Auth ----
export async function apiLogin(username, password) {
    const data = await req('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    if (data.token) setToken(data.token);
    return data;
}

export async function apiGetMe() { return req('/auth/me'); }

// ---- Store Owner ----
export async function apiGetStore(id) { return req(`/stores/${id}`); }
export async function apiUpdateStore(id, body) { return req(`/stores/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
export async function apiGetMenu(storeId) { return req(`/stores/${storeId}/menu`); }
export async function apiAddMenuItem(storeId, item) { return req(`/stores/${storeId}/menu`, { method: 'POST', body: JSON.stringify(item) }); }
export async function apiUpdateMenuItem(storeId, itemId, changes) { return req(`/stores/${storeId}/menu/${itemId}`, { method: 'PUT', body: JSON.stringify(changes) }); }
export async function apiDeleteMenuItem(storeId, itemId) { return req(`/stores/${storeId}/menu/${itemId}`, { method: 'DELETE' }); }
export async function apiGetStoreOrders(storeId) { return req(`/orders?storeId=${storeId}&all=true`); }
export async function apiUpdateOrderStatus(orderId, body) { return req(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify(body) }); }
export async function apiGetStoreAnalytics(storeId) { return req(`/stores/${storeId}/analytics`); }
export async function apiGetStorePayments(storeId) { return req(`/stores/${storeId}/payments`); }

// ---- Super Admin ----
export async function apiAdminDashboard() { return req('/admin/dashboard'); }
export async function apiAdminStores() { return req('/admin/stores'); }
export async function apiAdminAddStore(store) { return req('/admin/stores', { method: 'POST', body: JSON.stringify(store) }); }
export async function apiAdminUpdateStore(id, body) { return req(`/admin/stores/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
export async function apiAdminToggleStore(id) { return req(`/admin/stores/${id}/toggle`, { method: 'PUT' }); }
export async function apiAdminRemoveStore(id) { return req(`/admin/stores/${id}`, { method: 'DELETE' }); }
export async function apiAdminOrders(params) {
    const q = new URLSearchParams(params || {}).toString();
    return req(`/admin/orders${q ? '?' + q : ''}`);
}
export async function apiAdminFees() { return req('/admin/fees'); }
export async function apiAdminUpdateFee(feePerOrder) { return req('/admin/fees/config', { method: 'PUT', body: JSON.stringify({ feePerOrder }) }); }
export async function apiAdminSettle(storeId) { return req(`/admin/fees/${storeId}/settle`, { method: 'PUT' }); }
export async function apiAdminAnalytics() { return req('/admin/analytics'); }
export async function apiAdminFoodCourts() { return req('/admin/foodcourts'); }
export async function apiAdminAddFoodCourt(court) { return req('/admin/foodcourts', { method: 'POST', body: JSON.stringify(court) }); }
export async function apiAdminUpdateFoodCourt(id, body) { return req(`/admin/foodcourts/${id}`, { method: 'PUT', body: JSON.stringify(body) }); }
export async function apiAdminUpdateProfile(body) { return req('/admin/profile', { method: 'PUT', body: JSON.stringify(body) }); }
export async function apiAdminCredentialRequests() { return req('/admin/credential-requests'); }
export async function apiAdminResolveCredentialRequest(id) { return req(`/admin/credential-requests/${id}/resolve`, { method: 'PUT' }); }

// ---- Credential Request (public, no auth) ----
export async function apiSubmitCredentialRequest(data) {
    const res = await fetch(`${API_BASE}/auth/credential-request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `HTTP ${res.status}`); }
    return res.json();
}

// ---- WebSocket ----
let ws = null;
let listeners = new Set();

export function connectDashWS() {
    if (ws && ws.readyState <= 1) return;
    ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => { try { const d = JSON.parse(e.data); for (const fn of listeners) fn(d); } catch { } };
    ws.onclose = () => { setTimeout(connectDashWS, 2000); };
    ws.onerror = () => { ws.close(); };
}

export function onDashWSMessage(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function disconnectDashWS() { if (ws) { ws.close(); ws = null; } listeners.clear(); }
