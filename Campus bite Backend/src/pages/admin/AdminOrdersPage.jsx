import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './AdminOrdersPage.css';
const PLATFORM_FEE_PER_ORDER = 2;

function formatTime(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function AdminOrdersPage() {
    const { state } = useAdmin();
    const [storeFilter, setStoreFilter] = useState('all');

    const filtered = storeFilter === 'all'
        ? state.orders
        : state.orders.filter((o) => o.storeId === storeFilter);

    const completedCount = filtered.filter((o) => o.status === 'completed').length;
    const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);
    const totalFees = completedCount * PLATFORM_FEE_PER_ORDER;

    return (
        <div className="admin-orders">
            <div className="admin-orders__header">
                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>
                    All Orders ({filtered.length})
                </h2>
                <div className="admin-orders__filter">
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>Filter by store:</span>
                    <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}>
                        <option value="all">All Stores</option>
                        {state.stores.map((s) => (
                            <option key={s.id} value={s.id}>{s.image} {s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-orders__summary">
                <div className="admin-orders__summary-card">
                    <div className="admin-orders__summary-value">{filtered.length}</div>
                    <div className="admin-orders__summary-label">Total Orders</div>
                </div>
                <div className="admin-orders__summary-card">
                    <div className="admin-orders__summary-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="admin-orders__summary-label">Total Revenue</div>
                </div>
                <div className="admin-orders__summary-card">
                    <div className="admin-orders__summary-value admin-orders__summary-value--blue">₹{totalFees}</div>
                    <div className="admin-orders__summary-label">Platform Fees (₹{PLATFORM_FEE_PER_ORDER}/order)</div>
                </div>
            </div>

            <div className="admin-orders__table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Platform Fee</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((order) => (
                            <tr key={order.id}>
                                <td style={{ fontWeight: 600 }}>{order.id}</td>
                                <td>{order.storeName}</td>
                                <td>{order.customerName}</td>
                                <td style={{ fontSize: 'var(--fs-xs)' }}>
                                    {order.items.map((it) => `${it.name} ×${it.qty}`).join(', ')}
                                </td>
                                <td>₹{order.total}</td>
                                <td className="admin-orders__fee-col">
                                    {order.status === 'completed' ? `₹${PLATFORM_FEE_PER_ORDER}` : '—'}
                                </td>
                                <td>
                                    <span className={`badge badge--${order.paymentMethod === 'upi' ? 'blue' : order.paymentMethod === 'card' ? 'purple' : 'orange'}`}>
                                        {order.paymentMethod}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge badge--${order.status === 'completed' ? 'green' :
                                        order.status === 'new' ? 'orange' :
                                            order.status === 'preparing' ? 'blue' : 'red'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ fontSize: 'var(--fs-xs)' }}>{formatTime(order.placedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
