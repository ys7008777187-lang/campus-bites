import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { apiGetStoreAnalytics, apiGetStorePayments } from '../api';
import './PaymentsPage.css';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function PaymentsPage() {
    const { state } = useDashboard();
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.storeId) {
            Promise.all([
                apiGetStoreAnalytics(user.storeId),
                apiGetStorePayments(user.storeId),
            ]).then(([a, p]) => {
                setAnalytics(a);
                setPayments(p);
            }).catch(() => { }).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user?.storeId]);

    const summary = analytics || { todayRevenue: 0, todayOrders: 0, weekRevenue: 0, weekOrders: 0, monthRevenue: 0, monthOrders: 0 };

    if (loading) return <div className="payments-page"><div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}><span style={{ fontSize: '2rem' }}>⏳</span></div></div>;

    return (
        <div className="payments-page">
            {/* Revenue Summary */}
            <div className="revenue-cards">
                <div className="revenue-card">
                    <div className="revenue-card__period">Today</div>
                    <div className="revenue-card__amount">₹{(summary.todayRevenue || 0).toLocaleString()}</div>
                    <div className="revenue-card__orders">{summary.todayOrders || 0} orders</div>
                </div>
                <div className="revenue-card">
                    <div className="revenue-card__period">This Week</div>
                    <div className="revenue-card__amount">₹{(summary.weekRevenue || 0).toLocaleString()}</div>
                    <div className="revenue-card__orders">{summary.weekOrders || 0} orders</div>
                </div>
                <div className="revenue-card">
                    <div className="revenue-card__period">This Month</div>
                    <div className="revenue-card__amount">₹{(summary.monthRevenue || 0).toLocaleString()}</div>
                    <div className="revenue-card__orders">{summary.monthOrders || 0} orders</div>
                </div>
            </div>

            {/* QR + Table */}
            <div className="payments-grid">
                {/* QR Code */}
                <div className="qr-section">
                    <h3>UPI QR Code</h3>
                    <div className="qr-code-placeholder">📱</div>
                    <div className="qr-section__upi">{state.storeConfig?.upiId || '—'}</div>
                </div>

                {/* Payment History */}
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No payments yet</td></tr>
                            ) : payments.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{p.id}</td>
                                    <td style={{ fontWeight: 700 }}>₹{p.amount}</td>
                                    <td>
                                        <span className={`badge badge--${p.method === 'upi' ? 'blue' : p.method === 'card' ? 'purple' : 'yellow'}`}>
                                            {(p.method || '').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge--${p.status === 'settled' ? 'green' : 'orange'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{formatDate(p.date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
