import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoStar, IoTime, IoAdd, IoRemove } from 'react-icons/io5';
import { fetchStore, fetchMenu } from '../api';
import { useApp } from '../context/AppContext';
import './StorePage.css';

export default function StorePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useApp();

    const [store, setStore] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [s, m] = await Promise.all([fetchStore(id), fetchMenu(id)]);
                setStore(s);
                setItems(m);
            } catch { } finally { setLoading(false); }
        }
        load();
    }, [id]);

    const categories = [...new Set(items.map(m => m.category))];
    const [activeCategory, setActiveCategory] = useState('');

    // Set initial category when items load
    useEffect(() => {
        if (categories.length && !activeCategory) setActiveCategory(categories[0]);
    }, [items]);

    if (loading) return <div className="page"><div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}><span className="login-spinner" /></div></div>;

    if (!store) {
        return (
            <div className="page">
                <div className="empty-state">
                    <span className="empty-state__icon">❌</span>
                    <p className="empty-state__title">Store not found</p>
                    <button className="btn btn--primary" onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        );
    }

    const cartTotal = state.cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
    const cartCount = state.cart.reduce((sum, c) => sum + c.quantity, 0);
    const getCartQty = (itemId) => state.cart.find(c => c.id === itemId)?.quantity || 0;

    return (
        <div className="page store-page">
            {/* Banner */}
            <div className="store-banner">
                <button className="back-btn store-banner__back" onClick={() => navigate(-1)} aria-label="Go back">
                    <IoArrowBack />
                </button>
                <div className="store-banner__visual">
                    <span className="store-banner__emoji">{store.image}</span>
                </div>
                <div className="store-banner__info">
                    <h1 className="store-banner__name">{store.name}</h1>
                    <p className="store-banner__cuisine">{store.cuisine}</p>
                    <div className="store-banner__meta">
                        <span className="store-banner__rating"><IoStar className="store-banner__star" /> {store.rating}</span>
                        <span className="store-banner__prep"><IoTime /> {store.prepTime}</span>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs" role="tablist" aria-label="Menu categories">
                {categories.map(cat => (
                    <button
                        key={cat}
                        role="tab"
                        aria-selected={activeCategory === cat}
                        className={`category-tab ${activeCategory === cat ? 'category-tab--active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="menu-list">
                {items
                    .filter(m => m.category === activeCategory)
                    .map((item, i) => {
                        const qty = getCartQty(item.id);
                        return (
                            <div
                                key={item.id}
                                className="menu-item card"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="menu-item__left">
                                    <div className="menu-item__header">
                                        <span className={`veg-dot ${!item.isVeg ? 'veg-dot--nonveg' : ''}`} title={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'} />
                                        <h3 className="menu-item__name">{item.name}</h3>
                                    </div>
                                    <p className="menu-item__desc">{item.description}</p>
                                    <div className="menu-item__bottom">
                                        <span className="menu-item__price">₹{item.price}</span>
                                        <span className="menu-item__time"><IoTime /> {item.prepTime} min</span>
                                    </div>
                                </div>
                                <div className="menu-item__right">
                                    <span className="menu-item__emoji">{item.image}</span>
                                    {qty === 0 ? (
                                        <button
                                            className="menu-item__add-btn"
                                            onClick={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
                                            aria-label={`Add ${item.name} to cart`}
                                        >
                                            ADD
                                        </button>
                                    ) : (
                                        <div className="menu-item__qty-ctrl">
                                            <button
                                                onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty - 1 } })}
                                                aria-label={`Decrease quantity of ${item.name}`}
                                            >
                                                <IoRemove />
                                            </button>
                                            <span className="menu-item__qty">{qty}</span>
                                            <button
                                                onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty + 1 } })}
                                                aria-label={`Increase quantity of ${item.name}`}
                                            >
                                                <IoAdd />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Sticky Cart Bar */}
            {cartCount > 0 && state.cartStoreId === id && (
                <div className="sticky-cart animate-slide-up">
                    <div className="sticky-cart__info">
                        <span className="sticky-cart__count">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
                        <span className="sticky-cart__total">₹{cartTotal}</span>
                    </div>
                    <button className="btn btn--primary" onClick={() => navigate('/cart')}>
                        View Cart →
                    </button>
                </div>
            )}
        </div>
    );
}
