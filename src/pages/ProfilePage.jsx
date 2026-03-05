import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    IoPersonCircle, IoChevronForward, IoReceipt, IoHeart,
    IoLocationOutline, IoCardOutline, IoNotifications,
    IoSettingsOutline, IoHelpCircleOutline, IoInformationCircleOutline,
    IoLogOutOutline, IoStarOutline, IoShieldCheckmarkOutline,
    IoMoon, IoSunny
} from 'react-icons/io5';
import './ProfilePage.css';

export default function ProfilePage() {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();

    const decreaseFont = () => {
        const newScale = Math.max(0.8, state.fontScale - 0.1);
        dispatch({ type: 'SET_FONT_SCALE', payload: +newScale.toFixed(1) });
    };

    const increaseFont = () => {
        const newScale = Math.min(1.4, state.fontScale + 0.1);
        dispatch({ type: 'SET_FONT_SCALE', payload: +newScale.toFixed(1) });
    };

    const totalSpent = state.orders.reduce((s, o) => s + o.total, 0);

    const menuSections = [
        {
            title: 'Food Orders',
            items: [
                { icon: IoReceipt, label: 'Your Orders', sub: `${state.orders.length} orders placed`, action: () => navigate('/orders') },
                { icon: IoHeart, label: 'Favorites', sub: `${state.favoriteStoreIds.length} stores saved`, action: () => navigate('/favorites') },
                { icon: IoLocationOutline, label: 'Addresses', sub: 'Campus locations', action: null },
            ],
        },
        {
            title: 'Payments & Offers',
            items: [
                { icon: IoCardOutline, label: 'Payment Methods', sub: 'UPI, Cards & Wallets', action: null },
                { icon: IoStarOutline, label: 'Rewards', sub: `₹${totalSpent} total spent`, action: null },
            ],
        },
        {
            title: 'More',
            items: [
                { icon: IoNotifications, label: 'Notifications', sub: 'Order updates & offers', toggle: true },
                { icon: IoSettingsOutline, label: 'Settings', sub: 'App preferences', action: null },
                { icon: IoHelpCircleOutline, label: 'Help & Support', sub: 'FAQs & Contact us', action: null },
                { icon: IoInformationCircleOutline, label: 'About', sub: 'Campus Bites v1.0', action: null },
            ],
        },
    ];

    return (
        <div className="page profile-page">

            {/* --- Profile Header Card --- */}
            <div className="pf-header">
                <div className="pf-header__left">
                    <div className="pf-header__avatar">
                        <IoPersonCircle className="pf-header__avatar-icon" />
                        <span className="pf-header__avatar-edit">✏️</span>
                    </div>
                    <div className="pf-header__info">
                        <h1 className="pf-header__name">Campus User</h1>
                        <p className="pf-header__phone">+91 {state.user?.phone || '—'}</p>
                    </div>
                </div>
                <button className="pf-header__edit-btn" aria-label="Edit profile">
                    <IoChevronForward />
                </button>
            </div>

            {/* --- Membership / Rewards Card --- */}
            <div className="pf-membership">
                <div className="pf-membership__left">
                    <span className="pf-membership__badge">⚡</span>
                    <div>
                        <p className="pf-membership__title">Campus Bites Pro</p>
                        <p className="pf-membership__sub">Free delivery on all orders</p>
                    </div>
                </div>
                <span className="pf-membership__tag">Active</span>
            </div>

            {/* --- Stats Row --- */}
            <div className="pf-stats">
                <div className="pf-stats__item">
                    <span className="pf-stats__number">{state.orders.length}</span>
                    <span className="pf-stats__label">Orders</span>
                </div>
                <div className="pf-stats__divider" />
                <div className="pf-stats__item">
                    <span className="pf-stats__number">{state.favoriteStoreIds.length}</span>
                    <span className="pf-stats__label">Favorites</span>
                </div>
                <div className="pf-stats__divider" />
                <div className="pf-stats__item">
                    <span className="pf-stats__number">₹{totalSpent}</span>
                    <span className="pf-stats__label">Spent</span>
                </div>
            </div>

            {/* --- Font Size Accessibility --- */}
            <div className="pf-font-section">
                <div className="pf-font-section__header">
                    <IoShieldCheckmarkOutline className="pf-font-section__icon" />
                    <span className="pf-font-section__label">Text Size</span>
                    <span className="pf-font-section__value">{Math.round(state.fontScale * 100)}%</span>
                </div>
                <div className="pf-font-section__controls">
                    <button className="pf-font-btn" onClick={decreaseFont} disabled={state.fontScale <= 0.8} aria-label="Decrease font size">
                        A<sup>−</sup>
                    </button>
                    <div className="pf-font-bar">
                        <div className="pf-font-bar__fill" style={{ width: `${((state.fontScale - 0.8) / 0.6) * 100}%` }} />
                    </div>
                    <button className="pf-font-btn pf-font-btn--lg" onClick={increaseFont} disabled={state.fontScale >= 1.4} aria-label="Increase font size">
                        A<sup>+</sup>
                    </button>
                </div>
            </div>

            {/* --- Menu Sections --- */}
            {menuSections.map(section => (
                <div key={section.title} className="pf-menu-section">
                    <p className="pf-menu-section__title">{section.title}</p>
                    <div className="pf-menu-list">
                        {section.items.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.label}
                                    className="pf-menu-item"
                                    onClick={item.action || undefined}
                                    aria-label={item.label}
                                >
                                    <div className="pf-menu-item__icon-wrap">
                                        <Icon className="pf-menu-item__icon" />
                                    </div>
                                    <div className="pf-menu-item__text">
                                        <span className="pf-menu-item__label">{item.label}</span>
                                        <span className="pf-menu-item__sub">{item.sub}</span>
                                    </div>
                                    {item.toggle ? (
                                        <label className="toggle" onClick={e => e.stopPropagation()}>
                                            <input type="checkbox" defaultChecked />
                                            <span className="toggle__slider" />
                                        </label>
                                    ) : (
                                        <IoChevronForward className="pf-menu-item__arrow" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Logout */}
            <button className="pf-logout" onClick={() => dispatch({ type: 'LOGOUT' })}>
                <IoLogOutOutline className="pf-logout__icon" />
                <span>Log Out</span>
            </button>

            <p className="pf-footer">Made with 🧡 for campus life</p>
        </div>
    );
}
