import { useState, useEffect } from 'react';
import { apiAdminFees } from '../../api';
import './AdminFeesPage.css';

export default function AdminFeesPage() {
    const [feesData, setFeesData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiAdminFees().then(setFeesData).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="admin-fees"><div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}><span style={{ fontSize: '2rem' }}>⏳</span></div></div>;

    const { feePerOrder = 2, summary = {}, storeFees = [] } = feesData || {};
    const totalCollected = storeFees.reduce((sum, s) => sum + (s.settled || 0), 0);
    const totalPending = storeFees.reduce((sum, s) => sum + (s.pending || 0), 0);

    return (
        <div className="admin-fees">
            {/* Revenue Cards */}
            <div className="admin-fees__cards">
                <div className="admin-fees__card">
                    <div className="admin-fees__card-value">₹{summary.totalFeesToday || 0}</div>
                    <div className="admin-fees__card-label">Today's Fees</div>
                    <div className="admin-fees__card-sub">{summary.totalOrdersToday || 0} orders × ₹{feePerOrder}</div>
                </div>
                <div className="admin-fees__card">
                    <div className="admin-fees__card-value">₹{summary.totalFeesWeek || 0}</div>
                    <div className="admin-fees__card-label">This Week</div>
                    <div className="admin-fees__card-sub">{feePerOrder > 0 ? Math.round((summary.totalFeesWeek || 0) / feePerOrder) : 0} orders</div>
                </div>
                <div className="admin-fees__card">
                    <div className="admin-fees__card-value">₹{(summary.totalFeesMonth || 0).toLocaleString('en-IN')}</div>
                    <div className="admin-fees__card-label">This Month</div>
                    <div className="admin-fees__card-sub">{feePerOrder > 0 ? Math.round((summary.totalFeesMonth || 0) / feePerOrder).toLocaleString('en-IN') : 0} orders</div>
                </div>
            </div>

            {/* Per-Store Breakdown */}
            <div className="admin-fees__table">
                <h3 className="admin-fees__table-title">Per-Store Fee Breakdown</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Store</th>
                            <th>Completed Orders</th>
                            <th>Total Fees</th>
                            <th>Settled</th>
                            <th>Pending</th>
                            <th>Settlement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storeFees.map((row) => {
                            const pct = row.totalFees > 0 ? Math.round(((row.settled || 0) / row.totalFees) * 100) : 0;
                            return (
                                <tr key={row.storeId}>
                                    <td style={{ fontWeight: 600 }}>{row.storeName}</td>
                                    <td>{(row.completedOrders || 0).toLocaleString('en-IN')}</td>
                                    <td style={{ color: '#2563EB', fontWeight: 600 }}>₹{(row.totalFees || 0).toLocaleString('en-IN')}</td>
                                    <td style={{ color: 'var(--green)' }}>₹{(row.settled || 0).toLocaleString('en-IN')}</td>
                                    <td style={{ color: (row.pending || 0) > 0 ? 'var(--red)' : 'var(--green)' }}>
                                        ₹{(row.pending || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ minWidth: '120px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="admin-fees__settlement-bar">
                                                <div className="admin-fees__settlement-fill" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{pct}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        <tr style={{ fontWeight: 700, background: 'var(--bg-primary)' }}>
                            <td>Total</td>
                            <td>{storeFees.reduce((s, r) => s + (r.completedOrders || 0), 0).toLocaleString('en-IN')}</td>
                            <td style={{ color: '#2563EB' }}>₹{storeFees.reduce((s, r) => s + (r.totalFees || 0), 0).toLocaleString('en-IN')}</td>
                            <td style={{ color: 'var(--green)' }}>₹{totalCollected.toLocaleString('en-IN')}</td>
                            <td style={{ color: totalPending > 0 ? 'var(--red)' : 'var(--green)' }}>₹{totalPending.toLocaleString('en-IN')}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Fee Config */}
            <div className="admin-fees__config">
                <div className="admin-fees__config-left">
                    <h3>Platform Fee Rate</h3>
                    <p>Charged per completed order to each store</p>
                </div>
                <div className="admin-fees__config-amount">
                    ₹{feePerOrder}
                    <span className="admin-fees__config-unit">per order</span>
                </div>
            </div>
        </div>
    );
}
