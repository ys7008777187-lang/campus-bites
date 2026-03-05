import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { apiGetStoreAnalytics } from '../api';
import {
    HiOutlineCurrencyRupee,
    HiOutlineShoppingBag,
    HiOutlineClock,
    HiOutlineStar,
    HiOutlineClipboardList,
    HiOutlineBookOpen,
    HiOutlineCreditCard,
    HiOutlineLightningBolt,
} from 'react-icons/hi';
import './DashboardPage.css';

const kpis = [
    { key: 'todayRevenue', label: "Today's Revenue", icon: HiOutlineCurrencyRupee, color: 'orange', prefix: '₹', change: '+12%', up: true },
    { key: 'todayOrders', label: 'Orders Today', icon: HiOutlineShoppingBag, color: 'green', change: '+8%', up: true },
    { key: 'avgPrepTime', label: 'Avg Prep Time', icon: HiOutlineClock, color: 'blue', suffix: ' min', change: '-2 min', up: true },
    { key: 'rating', label: 'Store Rating', icon: HiOutlineStar, color: 'purple', suffix: ' ★', change: '+0.1', up: true },
];

export default function DashboardPage() {
    const { state } = useDashboard();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        if (user?.storeId) {
            apiGetStoreAnalytics(user.storeId).then(setAnalytics).catch(() => { });
        }
    }, [user?.storeId]);

    const activeOrders = state.orders.filter((o) => ['new', 'preparing', 'ready'].includes(o.status));
    const summary = analytics || { todayRevenue: 0, todayOrders: 0, avgPrepTime: 12, rating: state.storeConfig?.rating || 0 };
    const revenueByDay = analytics?.revenueByDay || [{ day: 'Mon', revenue: 0 }, { day: 'Tue', revenue: 0 }, { day: 'Wed', revenue: 0 }, { day: 'Thu', revenue: 0 }, { day: 'Fri', revenue: 0 }, { day: 'Sat', revenue: 0 }, { day: 'Sun', revenue: 0 }];
    const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);

    return (
        <div className="dashboard-page">
            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpis.map((kpi) => (
                    <div className="kpi-card" key={kpi.key}>
                        <div className={`kpi-card__icon kpi-card__icon--${kpi.color}`}>
                            <kpi.icon />
                        </div>
                        <div className="kpi-card__label">{kpi.label}</div>
                        <div className="kpi-card__value">
                            {kpi.prefix || ''}{(summary[kpi.key] ?? 0).toLocaleString()}{kpi.suffix || ''}
                        </div>
                        <div className={`kpi-card__change ${kpi.up ? 'kpi-card__change--up' : 'kpi-card__change--down'}`}>
                            {kpi.change} vs yesterday
                        </div>
                    </div>
                ))}
            </div>

            {/* Main content grid */}
            <div className="dashboard-grid">
                {/* Live Orders */}
                <div className="live-orders">
                    <div className="live-orders__header">
                        <h3><span className="live-orders__dot" />Live Orders ({activeOrders.length})</h3>
                        <button className="btn btn--sm btn--secondary" onClick={() => navigate('/store/orders')}>View All</button>
                    </div>
                    {activeOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state__icon">📭</div>
                            <div className="empty-state__title">No active orders</div>
                            <div className="empty-state__text">New orders will show up here</div>
                        </div>
                    ) : (
                        activeOrders.slice(0, 5).map((order, i) => (
                            <div className="live-order-card" key={order.id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="live-order-card__info">
                                    <h4>{order.customerName}</h4>
                                    <p>{order.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}</p>
                                </div>
                                <div className="live-order-card__right">
                                    <span className="live-order-card__amount">₹{order.total}</span>
                                    <span className={`badge badge--${order.status === 'new' ? 'orange' : order.status === 'preparing' ? 'blue' : 'green'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions__grid">
                        <button className="quick-action-btn" onClick={() => navigate('/store/orders')}>
                            <div className="quick-action-btn__icon kpi-card__icon--orange"><HiOutlineClipboardList /></div>
                            <span className="quick-action-btn__label">Manage Orders</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/store/menu')}>
                            <div className="quick-action-btn__icon kpi-card__icon--green"><HiOutlineBookOpen /></div>
                            <span className="quick-action-btn__label">Edit Menu</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/store/payments')}>
                            <div className="quick-action-btn__icon kpi-card__icon--blue"><HiOutlineCreditCard /></div>
                            <span className="quick-action-btn__label">View Payments</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/store/analytics')}>
                            <div className="quick-action-btn__icon kpi-card__icon--purple"><HiOutlineLightningBolt /></div>
                            <span className="quick-action-btn__label">Analytics</span>
                        </button>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="revenue-chart">
                    <h3>Revenue This Week</h3>
                    <div className="bar-chart">
                        {revenueByDay.map((d) => (
                            <div className="bar-chart__col" key={d.day}>
                                <span className="bar-chart__value">₹{(d.revenue / 1000).toFixed(1)}k</span>
                                <div
                                    className="bar-chart__bar"
                                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                                />
                                <span className="bar-chart__label">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
