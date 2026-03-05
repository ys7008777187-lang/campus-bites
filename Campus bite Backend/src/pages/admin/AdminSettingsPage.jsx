import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import './AdminSettingsPage.css';
const PLATFORM_FEE_PER_ORDER = 2;

const foodCourts = [
    { id: 'fc1', name: 'Central Food Court', icon: '🏫' },
    { id: 'fc2', name: 'Engineering Block Canteen', icon: '🔧' },
    { id: 'fc3', name: 'Sports Complex Café', icon: '⚽' },
];

export default function AdminSettingsPage() {
    const { state } = useAdmin();
    const [feeAmount, setFeeAmount] = useState(PLATFORM_FEE_PER_ORDER);

    const getStoreCount = (courtId) => state.stores.filter((s) => s.courtId === courtId).length;

    return (
        <div className="admin-settings">
            {/* Platform Fee */}
            <div className="admin-settings__section">
                <h3 className="admin-settings__section-title">💰 Platform Fee Configuration</h3>
                <div className="admin-settings__row">
                    <div className="admin-settings__row-label">
                        <h4>Fee Per Order</h4>
                        <p>Amount charged to stores for each completed order</p>
                    </div>
                    <div className="admin-settings__fee-input-wrap">
                        <span style={{ fontWeight: 600 }}>₹</span>
                        <input
                            type="number"
                            className="admin-settings__fee-input"
                            value={feeAmount}
                            onChange={(e) => setFeeAmount(Number(e.target.value))}
                            min={0}
                        />
                        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>per order</span>
                    </div>
                </div>
                <div className="admin-settings__row">
                    <div className="admin-settings__row-label">
                        <h4>Fee Collection</h4>
                        <p>How platform fees are collected from stores</p>
                    </div>
                    <span className="badge badge--blue">Auto-deduct</span>
                </div>
                <div className="admin-settings__row">
                    <div className="admin-settings__row-label">
                        <h4>Settlement Cycle</h4>
                        <p>How often settled amounts are processed</p>
                    </div>
                    <span className="badge badge--green">Weekly</span>
                </div>
            </div>

            {/* Admin Profile */}
            <div className="admin-settings__section">
                <h3 className="admin-settings__section-title">🛡️ Admin Profile</h3>
                <div className="admin-settings__row">
                    <div className="admin-settings__row-label">
                        <h4>Admin Name</h4>
                        <p>Campus Bites Platform Administrator</p>
                    </div>
                    <span style={{ fontWeight: 600 }}>Campus Admin</span>
                </div>
                <div className="admin-settings__row">
                    <div className="admin-settings__row-label">
                        <h4>Contact Email</h4>
                        <p>admin@campusbites.app</p>
                    </div>
                    <button className="btn btn--secondary" style={{ padding: '6px 16px', fontSize: 'var(--fs-xs)' }}>Edit</button>
                </div>
                <div className="admin-settings__row">
                    <div className="admin-settings__row-label">
                        <h4>Login Credentials</h4>
                        <p>Username: admin</p>
                    </div>
                    <button className="btn btn--secondary" style={{ padding: '6px 16px', fontSize: 'var(--fs-xs)' }}>Change Password</button>
                </div>
            </div>

            {/* Food Courts */}
            <div className="admin-settings__section">
                <h3 className="admin-settings__section-title">🏫 Food Court Management</h3>
                <div className="admin-settings__courts">
                    {foodCourts.map((court) => (
                        <div className="admin-settings__court-row" key={court.id}>
                            <div className="admin-settings__court-info">
                                <span className="admin-settings__court-icon">{court.icon}</span>
                                <div>
                                    <div className="admin-settings__court-name">{court.name}</div>
                                    <div className="admin-settings__court-stores">{getStoreCount(court.id)} stores registered</div>
                                </div>
                            </div>
                            <span className="badge badge--green">Active</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
