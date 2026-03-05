import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { HiOutlinePlus, HiOutlineClock } from 'react-icons/hi';
import './MenuPage.css';

export default function MenuPage() {
    const { state, dispatch } = useDashboard();
    const [activeCategory, setActiveCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Pizzas', price: '', prepTime: '', isVeg: true, image: '🍕', description: '' });

    const categories = ['All', ...new Set(state.menuItems.map((i) => i.category))];
    const filtered = activeCategory === 'All' ? state.menuItems : state.menuItems.filter((i) => i.category === activeCategory);

    const handleAddItem = () => {
        if (!newItem.name || !newItem.price || !newItem.prepTime) return;
        dispatch({
            type: 'ADD_ITEM',
            payload: { ...newItem, price: Number(newItem.price), prepTime: Number(newItem.prepTime) || 10, isAvailable: true },
        });
        setShowAddModal(false);
        setNewItem({ name: '', category: 'Pizzas', price: '', prepTime: '', isVeg: true, image: '🍕', description: '' });
    };

    return (
        <div className="menu-page">
            <div className="menu-page__header">
                <div>
                    <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>{state.menuItems.length} Items</h2>
                </div>
                <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
                    <HiOutlinePlus /> Add Item
                </button>
            </div>

            <div className="menu-page__categories">
                <div className="pill-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`pill-tab ${activeCategory === cat ? 'pill-tab--active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="menu-grid">
                {filtered.map((item, i) => (
                    <div
                        className={`menu-item-card ${!item.isAvailable ? 'menu-item-card--unavailable' : ''}`}
                        key={item.id}
                        style={{ animationDelay: `${i * 0.04}s` }}
                    >
                        <div className="menu-item-card__toggle">
                            <button
                                className={`toggle ${item.isAvailable ? 'toggle--active' : ''}`}
                                onClick={() => dispatch({ type: 'TOGGLE_ITEM_AVAILABILITY', payload: item.id })}
                                aria-label={`Toggle ${item.name} availability`}
                            />
                        </div>

                        <div className="menu-item-card__top">
                            <div className="menu-item-card__emoji">{item.image}</div>
                            <div className="menu-item-card__info">
                                <div className="menu-item-card__name">
                                    <div className={`veg-dot ${item.isVeg ? '' : 'veg-dot--nonveg'}`} />
                                    {item.name}
                                </div>
                                <div className="menu-item-card__desc">{item.description}</div>
                            </div>
                        </div>

                        <div className="menu-item-card__meta">
                            <span className="menu-item-card__price">₹{item.price}</span>
                            <span className="menu-item-card__prep"><HiOutlineClock /> {item.prepTime} min</span>
                            <span className={`badge ${item.isAvailable ? 'badge--green' : 'badge--red'}`}>
                                {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Item</h2>
                        <div className="modal__field">
                            <label>Item Name</label>
                            <input className="input" placeholder="e.g. Farmhouse Pizza" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                        </div>
                        <div className="modal__field">
                            <label>Category</label>
                            <select className="input" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                                {['Pizzas', 'Pasta', 'Sides', 'Beverages', 'Desserts'].map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="modal__field">
                            <label>Price (₹)</label>
                            <input className="input" type="number" placeholder="199" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                        </div>
                        <div className="modal__field">
                            <label>Average Preparation Time <span style={{ color: '#ef4444' }}>*</span></label>
                            <select className="input" value={newItem.prepTime} onChange={(e) => setNewItem({ ...newItem, prepTime: e.target.value })}>
                                <option value="">Select prep time</option>
                                <option value="5">5 minutes</option>
                                <option value="10">10 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="20">20 minutes</option>
                                <option value="25">25 minutes</option>
                                <option value="30">30 minutes</option>
                            </select>
                        </div>
                        <div className="modal__field">
                            <label>Description</label>
                            <input className="input" placeholder="Short description..." value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                        </div>
                        <div className="modal__field" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{ margin: 0 }}>Vegetarian</label>
                            <button className={`toggle ${newItem.isVeg ? 'toggle--active' : ''}`} onClick={() => setNewItem({ ...newItem, isVeg: !newItem.isVeg })} />
                        </div>
                        <div className="modal__actions">
                            <button className="btn btn--secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn btn--primary" onClick={handleAddItem}>Add Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
