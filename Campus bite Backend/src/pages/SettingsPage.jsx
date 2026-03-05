import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import './SettingsPage.css';

const notificationPrefs = [
    { key: 'newOrder', title: 'New Order Alerts', desc: 'Get notified when a new order arrives' },
    { key: 'lowStock', title: 'Low Stock Warnings', desc: 'Alert when items are running low' },
    { key: 'reviews', title: 'Review Notifications', desc: 'Get notified about new customer reviews' },
    { key: 'daily', title: 'Daily Summary', desc: 'Receive a daily revenue & order summary' },
];

export default function SettingsPage() {
    const { state, dispatch } = useDashboard();
    const { storeConfig } = state;
    const [storeName, setStoreName] = useState(storeConfig.name);
    const [cuisine, setCuisine] = useState(storeConfig.cuisine);
    const [description, setDescription] = useState(storeConfig.description);
    const [phone, setPhone] = useState(storeConfig.phone);
    const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, reviews: false, daily: true });

    const handleSave = () => {
        dispatch({ type: 'UPDATE_STORE', payload: { name: storeName, cuisine, description, phone } });
    };

    return (
        <div className="settings-page">
            {/* Store Profile */}
            <div className="settings-section">
                <h3>🏪 Store Profile</h3>
                <div className="settings-field">
                    <label>Store Name</label>
                    <input className="input" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div className="settings-field">
                    <label>Cuisine Type</label>
                    <input className="input" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
                </div>
                <div className="settings-field">
                    <label>Description</label>
                    <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="settings-field">
                    <label>Phone</label>
                    <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <button className="btn btn--primary" style={{ marginTop: 'var(--sp-4)' }} onClick={handleSave}>
                    Save Changes
                </button>
            </div>

            {/* Operating Hours */}
            <div className="settings-section">
                <h3>🕐 Operating Hours</h3>
                <div className="hours-grid">
                    {Object.entries(storeConfig.operatingHours).map(([day, hrs]) => (
                        <div className={`hours-row ${!hrs.isOpen ? 'hours-row--closed' : ''}`} key={day}>
                            <span className="hours-row__day">{day}</span>
                            <div className="hours-row__times">
                                <input type="time" defaultValue={hrs.open} disabled={!hrs.isOpen} />
                                <span>to</span>
                                <input type="time" defaultValue={hrs.close} disabled={!hrs.isOpen} />
                            </div>
                            <button
                                className={`toggle ${hrs.isOpen ? 'toggle--active' : ''}`}
                                onClick={() => {
                                    const updated = { ...storeConfig.operatingHours, [day]: { ...hrs, isOpen: !hrs.isOpen } };
                                    dispatch({ type: 'UPDATE_STORE', payload: { operatingHours: updated } });
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="settings-section">
                <h3>🔔 Notifications</h3>
                {notificationPrefs.map((pref) => (
                    <div className="notification-row" key={pref.key}>
                        <div className="notification-row__info">
                            <h4>{pref.title}</h4>
                            <p>{pref.desc}</p>
                        </div>
                        <button
                            className={`toggle ${notifs[pref.key] ? 'toggle--active' : ''}`}
                            onClick={() => setNotifs({ ...notifs, [pref.key]: !notifs[pref.key] })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
