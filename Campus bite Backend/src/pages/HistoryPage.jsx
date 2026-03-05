import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { HiOutlineSearch } from 'react-icons/hi';
import './HistoryPage.css';

const dateFilters = ['Today', 'This Week', 'This Month', 'All'];

function formatTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPage() {
    const { state } = useDashboard();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('All');

    const pastOrders = state.orders.filter((o) => ['completed', 'rejected'].includes(o.status));

    const filtered = pastOrders.filter((o) => {
        if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase()) && !o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    });

    const totalRevenue = filtered.filter((o) => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const avgOrderValue = filtered.length > 0 ? Math.round(totalRevenue / filtered.filter((o) => o.status === 'completed').length) || 0 : 0;

    return (
        <div className="history-page">
            <div className="history-page__controls">
                <div className="pill-tabs">
                    {dateFilters.map((f) => (
                        <button
                            key={f}
                            className={`pill-tab ${dateFilter === f ? 'pill-tab--active' : ''}`}
                            onClick={() => setDateFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="history-page__search">
                    <HiOutlineSearch className="history-page__search-icon" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="history-stats">
                <div className="history-stat">
                    <div className="history-stat__value">{filtered.filter((o) => o.status === 'completed').length}</div>
                    <div className="history-stat__label">Completed Orders</div>
                </div>
                <div className="history-stat">
                    <div className="history-stat__value">₹{totalRevenue.toLocaleString()}</div>
                    <div className="history-stat__label">Total Revenue</div>
                </div>
                <div className="history-stat">
                    <div className="history-stat__value">₹{avgOrderValue}</div>
                    <div className="history-stat__label">Avg Order Value</div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <div className="empty-state__title">No orders found</div>
                    <div className="empty-state__text">Try adjusting your filters</div>
                </div>
            ) : (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.id}</td>
                                    <td>{order.customerName}</td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>
                                        {order.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>₹{order.total}</td>
                                    <td>
                                        <span className={`badge badge--${order.paymentMethod === 'upi' ? 'blue' : order.paymentMethod === 'card' ? 'purple' : 'yellow'}`}>
                                            {order.paymentMethod.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge--${order.status === 'completed' ? 'green' : 'red'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
                                        {formatTime(order.completedAt || order.placedAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
