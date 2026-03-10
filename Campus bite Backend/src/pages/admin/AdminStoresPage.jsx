import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { apiAdminFoodCourts } from '../../api';
import { HiOutlinePlus, HiOutlineStar, HiOutlineClipboardCopy, HiOutlineCheckCircle } from 'react-icons/hi';
import './AdminStoresPage.css';
const PLATFORM_FEE_PER_ORDER = 2;

export default function AdminStoresPage() {
    const { state, dispatch } = useAdmin();
    const [showModal, setShowModal] = useState(false);
    const [courtOptions, setCourtOptions] = useState([]);
    const [createdCreds, setCreatedCreds] = useState(null);
    const [copied, setCopied] = useState('');
    const [form, setForm] = useState({
        name: '', cuisine: '', image: '🍽️', imageUrl: '', courtId: '',
        ownerName: '', phone: '', upiId: '',
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Fetch food courts for the dropdown
    useEffect(() => {
        apiAdminFoodCourts()
            .then(courts => {
                setCourtOptions(courts);
            })
            .catch(() => { });
    }, []);

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch({ type: 'ADD_STORE', payload: form });
            if (result && result.credentials) {
                setCreatedCreds(result.credentials);
            }
            setForm({ name: '', cuisine: '', image: '🍽️', imageUrl: '', courtId: courtOptions[0]?.id || '', ownerName: '', phone: '', upiId: '' });
            setShowModal(false);
        } catch (err) {
            console.error('Failed to add store:', err);
        }
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };

    const handleCloseCredentials = () => {
        setCreatedCreds(null);
        setCopied('');
    };

    return (
        <div className="admin-stores">
            <div className="admin-stores__header">
                <h2>Manage Stores ({state.stores.length})</h2>
                <button className="btn btn--primary" onClick={() => setShowModal(true)}>
                    <HiOutlinePlus /> Add Store
                </button>
            </div>

            <div className="admin-stores__grid">
                {state.stores.map((store, i) => (
                    <div
                        className={`admin-store-card ${store.isOpen ? 'admin-store-card--open' : 'admin-store-card--closed'}`}
                        key={store.id}
                        style={{ animationDelay: `${i * 0.05}s` }}
                    >
                        <div className="admin-store-card__top">
                            <div className="admin-store-card__icon">
                                {store.imageUrl
                                    ? <img src={store.imageUrl} alt={store.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                    : store.image
                                }
                            </div>
                            <div className="admin-store-card__info">
                                <h3>{store.name}</h3>
                                <div className="admin-store-card__cuisine">{store.cuisine}</div>
                                <div className="admin-store-card__owner">👤 {store.ownerName}</div>
                            </div>
                        </div>

                        <div className="admin-store-card__stats">
                            <div className="admin-store-card__stat">
                                <div className="admin-store-card__stat-value">{store.todayOrders}</div>
                                <div className="admin-store-card__stat-label">Today</div>
                            </div>
                            <div className="admin-store-card__stat">
                                <div className="admin-store-card__stat-value">₹{((store.monthRevenue || 0) / 1000).toFixed(1)}k</div>
                                <div className="admin-store-card__stat-label">Monthly Rev</div>
                            </div>
                            <div className="admin-store-card__stat">
                                <div className="admin-store-card__stat-value" style={{ color: '#2563EB' }}>₹{(store.monthOrders || 0) * PLATFORM_FEE_PER_ORDER}</div>
                                <div className="admin-store-card__stat-label">Fees Owed</div>
                            </div>
                        </div>

                        <div className="admin-store-card__actions">
                            <div className="admin-store-card__rating">
                                <HiOutlineStar /> {store.rating} ({store.totalReviews})
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className={`badge ${store.isOpen ? 'badge--green' : 'badge--red'}`}>
                                    {store.isOpen ? 'Open' : 'Closed'}
                                </span>
                                <button
                                    className={`toggle ${store.isOpen ? 'toggle--active' : ''}`}
                                    onClick={() => dispatch({ type: 'TOGGLE_STORE_STATUS', payload: store.id })}
                                    aria-label={`Toggle ${store.name}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Store Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="admin-modal">
                        <h3 className="admin-modal__title">Add New Store</h3>
                        <form className="admin-modal__form" onSubmit={handleAddStore}>
                            <div className="admin-modal__row">
                                <div className="admin-modal__field">
                                    <label>Store Name *</label>
                                    <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Pizza Planet" />
                                </div>
                                <div className="admin-modal__field">
                                    <label>Cuisine Type *</label>
                                    <input className="input" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} required placeholder="e.g. Italian & Pizza" />
                                </div>
                            </div>
                            <div className="admin-modal__row">
                                <div className="admin-modal__field">
                                    <label>Icon (Emoji)</label>
                                    <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="🍽️" />
                                </div>
                                <div className="admin-modal__field">
                                    <label>Store Image (optional)</label>
                                    <input className="input" type="file" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>
                            {/* Image preview */}
                            {form.imageUrl && (
                                <div style={{ marginBottom: 12, textAlign: 'center' }}>
                                    <img src={form.imageUrl} alt="Store preview" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                            <div className="admin-modal__field">
                                <label>Food Court *</label>
                                <select className="input" value={form.courtId} onChange={(e) => setForm({ ...form, courtId: e.target.value })} required>
                                    <option value="" disabled>Select a Food Court</option>
                                    {courtOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="admin-modal__field">
                                <label>Owner Name *</label>
                                <input className="input" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} required placeholder="e.g. Rahul Sharma" />
                            </div>
                            <div className="admin-modal__row">
                                <div className="admin-modal__field">
                                    <label>Phone *</label>
                                    <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+91 98765 43210" />
                                </div>
                                <div className="admin-modal__field">
                                    <label>UPI ID *</label>
                                    <input className="input" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} required placeholder="storename@upi" />
                                </div>
                            </div>

                            <div className="admin-modal__info" style={{ background: '#EFF6FF', padding: '10px 14px', borderRadius: 8, marginTop: 4, fontSize: '0.85rem', color: '#1D4ED8' }}>
                                🔑 Login credentials will be auto-generated for the store owner after creation.
                            </div>

                            <div className="admin-modal__actions">
                                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn--primary">Add Store</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Credentials Popup */}
            {createdCreds && (
                <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseCredentials()}>
                    <div className="admin-modal" style={{ maxWidth: 420 }}>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <HiOutlineCheckCircle style={{ fontSize: 48, color: '#22C55E' }} />
                            <h3 className="admin-modal__title" style={{ marginTop: 8 }}>Store Created Successfully!</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Share these credentials with the store owner to log in to the dashboard.</p>
                        </div>

                        <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Username</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>{createdCreds.username}</div>
                                </div>
                                <button
                                    className="btn btn--secondary"
                                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                    onClick={() => handleCopy(createdCreds.username, 'username')}
                                >
                                    {copied === 'username' ? '✓ Copied' : <><HiOutlineClipboardCopy /> Copy</>}
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Password</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>{createdCreds.password}</div>
                                </div>
                                <button
                                    className="btn btn--secondary"
                                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                                    onClick={() => handleCopy(createdCreds.password, 'password')}
                                >
                                    {copied === 'password' ? '✓ Copied' : <><HiOutlineClipboardCopy /> Copy</>}
                                </button>
                            </div>
                        </div>

                        <div style={{ background: '#FFFBEB', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', color: '#92400E', marginBottom: 16 }}>
                            ⚠️ Save these credentials now. They won't be shown again.
                        </div>

                        <div className="admin-modal__actions" style={{ justifyContent: 'center' }}>
                            <button className="btn btn--primary" onClick={handleCloseCredentials}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
