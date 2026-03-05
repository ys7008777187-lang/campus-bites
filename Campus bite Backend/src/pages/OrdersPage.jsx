import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import './OrdersPage.css';

const tabs = [
    { key: 'new', label: 'New' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'all', label: 'All Active' },
];

function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`;
}

export default function OrdersPage() {
    const { state, dispatch } = useDashboard();
    const [activeTab, setActiveTab] = useState('new');

    const filtered = state.orders.filter((o) => {
        if (activeTab === 'all') return ['new', 'preparing', 'ready'].includes(o.status);
        return o.status === activeTab;
    });

    return (
        <div className="orders-page">
            <div className="orders-page__tabs">
                <div className="pill-tabs">
                    {tabs.map((tab) => {
                        const count = state.orders.filter((o) =>
                            tab.key === 'all'
                                ? ['new', 'preparing', 'ready'].includes(o.status)
                                : o.status === tab.key
                        ).length;
                        return (
                            <button
                                key={tab.key}
                                className={`pill-tab ${activeTab === tab.key ? 'pill-tab--active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">📭</div>
                    <div className="empty-state__title">No {activeTab} orders</div>
                    <div className="empty-state__text">Orders will appear here when customers place them</div>
                </div>
            ) : (
                <div className="orders-grid">
                    {filtered.map((order, i) => (
                        <div
                            className={`order-card order-card--${order.status}`}
                            key={order.id}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="order-card__header">
                                <span className="order-card__id">{order.id}</span>
                                <span className="order-card__time">{timeAgo(order.placedAt)}</span>
                            </div>

                            <div className="order-card__customer">{order.customerName}</div>

                            <div className="order-card__items">
                                {order.items.map((item, idx) => (
                                    <div className="order-card__item" key={idx}>
                                        <span>{item.qty}× {item.name}</span>
                                        <span>₹{item.qty * item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card__footer">
                                <span className="order-card__total">₹{order.total}</span>
                                <span className="order-card__method">{order.paymentMethod}</span>
                            </div>

                            {/* Actions */}
                            {order.status === 'new' && (
                                <div className="order-card__actions">
                                    <button className="btn btn--success btn--sm" onClick={() => dispatch({ type: 'ACCEPT_ORDER', payload: order.id })}>
                                        ✓ Accept
                                    </button>
                                    <button className="btn btn--danger btn--sm" onClick={() => dispatch({ type: 'REJECT_ORDER', payload: { id: order.id, reason: 'Busy' } })}>
                                        ✕ Reject
                                    </button>
                                </div>
                            )}

                            {order.status === 'preparing' && (
                                <div className="order-card__actions">
                                    <button className="btn btn--primary btn--sm btn--full" onClick={() => dispatch({ type: 'MARK_READY', payload: order.id })}>
                                        🔔 Mark Ready
                                    </button>
                                </div>
                            )}

                            {order.status === 'ready' && (
                                <div className="order-card__otp">
                                    <div>
                                        <div className="order-card__otp-label">Verification OTP</div>
                                        <div className="order-card__otp-code">{order.otp}</div>
                                    </div>
                                    <button className="btn btn--success btn--sm" style={{ marginLeft: 'auto' }} onClick={() => dispatch({ type: 'COMPLETE_ORDER', payload: order.id })}>
                                        ✓ Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
