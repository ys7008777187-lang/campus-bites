import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoStar, IoTime, IoAdd, IoRemove, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { fetchFoodCourt, fetchStores, fetchMenu } from '../api';
import { useApp } from '../context/AppContext';
import './FoodCourtPage.css';

export default function FoodCourtPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useApp();

    const [court, setCourt] = useState(null);
    const [courtStores, setCourtStores] = useState([]);
    const [storeMenuItems, setStoreMenuItems] = useState([]);
    const [activeStoreId, setActiveStoreId] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch court and stores on mount
    useEffect(() => {
        async function load() {
            try {
                const [courtData, storesData] = await Promise.all([fetchFoodCourt(id), fetchStores(id)]);
                setCourt(courtData);
                setCourtStores(storesData);
                const first = storesData.find(s => s.isOpen) || storesData[0];
                if (first) {
                    setActiveStoreId(first.id);
                    const menu = await fetchMenu(first.id);
                    setStoreMenuItems(menu);
                    const cats = [...new Set(menu.map(m => m.category))];
                    setActiveCategory(cats[0] || '');
                }
            } catch { } finally { setLoading(false); }
        }
        load();
    }, [id]);

    const categories = [...new Set(storeMenuItems.map(m => m.category))];

    const handleStoreChange = async (storeId) => {
        setActiveStoreId(storeId);
        try {
            const menu = await fetchMenu(storeId);
            setStoreMenuItems(menu);
            const cats = [...new Set(menu.map(m => m.category))];
            setActiveCategory(cats[0] || '');
        } catch { }
    };

    const activeStore = courtStores.find(s => s.id === activeStoreId);

    // Cart helpers
    const cartTotal = state.cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
    const cartCount = state.cart.reduce((sum, c) => sum + c.quantity, 0);
    const getCartQty = (itemId) => state.cart.find(c => c.id === itemId)?.quantity || 0;

    if (loading) return <div className="page"><div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}><span className="login-spinner" /></div></div>;

    if (!court) {
        return (
            <div className="page">
                <div className="empty-state">
                    <span className="empty-state__icon">❌</span>
                    <p className="empty-state__title">Court not found</p>
                    <button className="btn btn--primary" onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page court-page">
            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                    <IoArrowBack />
                </button>
                <div>
                    <h1>{court.name}</h1>
                    <p className="court-page__sub">{court.description}</p>
                </div>
            </div>

            {/* Shop Tabs */}
            <div className="shop-tabs" role="tablist" aria-label="Shops">
                {courtStores.map(store => {
                    const isFav = state.favoriteStoreIds.includes(store.id);
                    const isActive = activeStoreId === store.id;
                    return (
                        <button
                            key={store.id}
                            role="tab"
                            aria-selected={isActive}
                            className={`shop-tab ${isActive ? 'shop-tab--active' : ''} ${!store.isOpen ? 'shop-tab--closed' : ''}`}
                            onClick={() => store.isOpen && handleStoreChange(store.id)}
                            disabled={!store.isOpen}
                        >
                            <span className="shop-tab__emoji">{store.image}</span>
                            <span className="shop-tab__name">{store.name}</span>
                            {!store.isOpen && <span className="shop-tab__badge">Closed</span>}
                        </button>
                    );
                })}
            </div>

            {/* Active Store Info Bar */}
            {activeStore && (
                <div className="store-info-bar">
                    <div className="store-info-bar__left">
                        <h2 className="store-info-bar__name">{activeStore.name}</h2>
                        <p className="store-info-bar__cuisine">{activeStore.cuisine}</p>
                    </div>
                    <div className="store-info-bar__right">
                        <span className="store-info-bar__rating">
                            <IoStar /> {activeStore.rating}
                        </span>
                        <span className="store-info-bar__prep">
                            <IoTime /> {activeStore.prepTime}
                        </span>
                        <button
                            className="store-info-bar__fav"
                            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: activeStore.id })}
                            aria-label={state.favoriteStoreIds.includes(activeStore.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            {state.favoriteStoreIds.includes(activeStore.id)
                                ? <IoHeart className="store-info-bar__fav-icon--active" />
                                : <IoHeartOutline />
                            }
                        </button>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
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
            )}

            {/* Menu Items */}
            <div className="menu-list">
                {storeMenuItems
                    .filter(m => m.category === activeCategory)
                    .map((item, i) => {
                        const qty = getCartQty(item.id);
                        return (
                            <div
                                key={item.id}
                                className="menu-item"
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
            {cartCount > 0 && state.cartStoreId === activeStoreId && (
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
