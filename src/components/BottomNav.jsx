import { NavLink } from 'react-router-dom';
import { IoCompass, IoReceipt, IoHeart, IoPersonCircle } from 'react-icons/io5';
import { useApp } from '../context/AppContext';
import './BottomNav.css';

const tabs = [
    { to: '/', icon: IoCompass, label: 'Explore' },
    { to: '/orders', icon: IoReceipt, label: 'Orders' },
    { to: '/favorites', icon: IoHeart, label: 'Favorites' },
    { to: '/profile', icon: IoPersonCircle, label: 'Profile' },
];

export default function BottomNav() {
    const { state } = useApp();
    const activeOrders = state.orders.filter(o => o.status === 'preparing' || o.status === 'ready').length;

    return (
        <nav className="bottom-nav" aria-label="Main navigation">
            {tabs.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `bottom-nav__tab ${isActive ? 'bottom-nav__tab--active' : ''}`}
                    aria-label={label}
                >
                    <span className="bottom-nav__icon-wrap">
                        <Icon className="bottom-nav__icon" />
                        {label === 'Orders' && activeOrders > 0 && (
                            <span className="bottom-nav__badge">{activeOrders}</span>
                        )}
                    </span>
                    <span className="bottom-nav__label">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
