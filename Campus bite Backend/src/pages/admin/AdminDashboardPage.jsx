import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { apiAdminDashboard } from '../../api';
import {
    HiOutlineOfficeBuilding,
    HiOutlineShoppingBag,
    HiOutlineCurrencyRupee,
    HiOutlineWifi,
} from 'react-icons/hi';
import './AdminDashboardPage.css';

const PLATFORM_FEE_PER_ORDER = 2;

export default function AdminDashboardPage() {
    const { state } = useAdmin();
    const { stores, orders } = state;
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        apiAdminDashboard().then(setDashboard).catch(() => { });
    }, []);

    const activeStores = stores.filter((s) => s.isOpen).length;
    const todayOrders = dashboard?.todayOrders || stores.reduce((sum, s) => sum + (s.todayOrders || 0), 0);
    const feesEarnedToday = dashboard?.feesEarnedToday || 0;

    const platformFeesByDay = dashboard?.platformFeesByDay || [{ day: 'Mon', fees: 0 }, { day: 'Tue', fees: 0 }, { day: 'Wed', fees: 0 }, { day: 'Thu', fees: 0 }, { day: 'Fri', fees: 0 }, { day: 'Sat', fees: 0 }, { day: 'Sun', fees: 0 }];
    const maxFee = Math.max(...platformFeesByDay.map((d) => d.fees), 1);

    return (
        <div className="admin-dashboard">
            {/* KPI Cards */}
            <div className="admin-kpi-grid">
                <div className="admin-kpi">
                    <div className="admin-kpi__icon admin-kpi__icon--blue">
                        <HiOutlineOfficeBuilding />
                    </div>
                    <div>
                        <div className="admin-kpi__value">{stores.length}</div>
                        <div className="admin-kpi__label">Total Stores</div>
                    </div>
                </div>
                <div className="admin-kpi">
                    <div className="admin-kpi__icon admin-kpi__icon--green">
                        <HiOutlineWifi />
                    </div>
                    <div>
                        <div className="admin-kpi__value">{activeStores}</div>
                        <div className="admin-kpi__label">Active Stores</div>
                    </div>
                </div>
                <div className="admin-kpi">
                    <div className="admin-kpi__icon admin-kpi__icon--orange">
                        <HiOutlineShoppingBag />
                    </div>
                    <div>
                        <div className="admin-kpi__value">{todayOrders}</div>
                        <div className="admin-kpi__label">Orders Today</div>
                    </div>
                </div>
                <div className="admin-kpi">
                    <div className="admin-kpi__icon admin-kpi__icon--purple">
                        <HiOutlineCurrencyRupee />
                    </div>
                    <div>
                        <div className="admin-kpi__value">₹{feesEarnedToday}</div>
                        <div className="admin-kpi__label">Platform Fees Today</div>
                    </div>
                </div>
            </div>

            {/* Store Status + Fees Chart */}
            <div className="admin-dashboard__grid">
                <div className="admin-store-panel">
                    <h3 className="admin-store-panel__title">Store Status</h3>
                    <div className="admin-store-list">
                        {stores.map((store) => (
                            <div className="admin-store-row" key={store.id}>
                                <div className="admin-store-row__left">
                                    <span className="admin-store-row__icon">{store.image}</span>
                                    <div>
                                        <div className="admin-store-row__name">{store.name}</div>
                                        <div className="admin-store-row__cuisine">{store.cuisine}</div>
                                    </div>
                                </div>
                                <div className="admin-store-row__right">
                                    <span className="admin-store-row__orders">{store.todayOrders} orders</span>
                                    <span className={`badge ${store.isOpen ? 'badge--green' : 'badge--red'}`}>
                                        {store.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-fees-chart">
                    <h3 className="admin-fees-chart__title">Platform Fees (₹{PLATFORM_FEE_PER_ORDER}/order)</h3>
                    <div className="admin-fees-chart__bars">
                        {platformFeesByDay.map((d) => (
                            <div className="admin-fees-chart__bar-wrap" key={d.day}>
                                <div
                                    className="admin-fees-chart__bar"
                                    style={{ height: `${(d.fees / maxFee) * 100}%` }}
                                >
                                    <span className="admin-fees-chart__bar-value">₹{d.fees}</span>
                                </div>
                                <span className="admin-fees-chart__bar-label">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders Across All Stores */}
            <div className="admin-recent-orders">
                <h3 className="admin-recent-orders__title">Recent Orders (All Stores)</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Store</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Fee</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 8).map((order) => (
                            <tr key={order.id}>
                                <td style={{ fontWeight: 600 }}>{order.id}</td>
                                <td>{order.storeName}</td>
                                <td>{order.customerName}</td>
                                <td>₹{order.total}</td>
                                <td style={{ color: '#2563EB', fontWeight: 600 }}>₹{PLATFORM_FEE_PER_ORDER}</td>
                                <td>
                                    <span className={`badge badge--${order.status === 'completed' ? 'green' :
                                        order.status === 'new' ? 'orange' :
                                            order.status === 'preparing' ? 'blue' : 'red'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
