import { NavLink, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome,
    HiOutlineClipboardList,
    HiOutlineClock,
    HiOutlineBookOpen,
    HiOutlineCreditCard,
    HiOutlineChartBar,
    HiOutlineCog,
    HiOutlineLogout,
} from 'react-icons/hi';
import './Sidebar.css';

const navItems = [
    { path: '/store', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/store/orders', icon: HiOutlineClipboardList, label: 'Orders', badgeKey: 'new' },
    { path: '/store/history', icon: HiOutlineClock, label: 'History' },
    { path: '/store/menu', icon: HiOutlineBookOpen, label: 'Menu' },
    { path: '/store/payments', icon: HiOutlineCreditCard, label: 'Payments' },
    { path: '/store/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { path: '/store/settings', icon: HiOutlineCog, label: 'Settings' },
];

export default function Sidebar() {
    const { state, dispatch } = useDashboard();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const storeConfig = state.storeConfig || {};
    const newOrderCount = (state.orders || []).filter((o) => o.status === 'new').length;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__logo">{storeConfig.image || '🏪'}</div>
                <div className="sidebar__brand-text">
                    <h3>{storeConfig.name || 'Loading...'}</h3>
                    <span>Store Dashboard</span>
                </div>
            </div>

            <nav className="sidebar__nav">
                {navItems.map(({ path, icon: Icon, label, badgeKey }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/store'}
                        className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar__link-icon"><Icon /></span>
                        <span>{label}</span>
                        {badgeKey === 'new' && newOrderCount > 0 && (
                            <span className="sidebar__link-badge">{newOrderCount}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__store-toggle">
                    <span className={`sidebar__store-status ${storeConfig.isOpen ? 'sidebar__store-status--open' : 'sidebar__store-status--closed'}`}>
                        {storeConfig.isOpen ? '● Open' : '● Closed'}
                    </span>
                    <button
                        className={`toggle ${storeConfig.isOpen ? 'toggle--active' : ''}`}
                        onClick={() => dispatch({ type: 'TOGGLE_STORE' })}
                        aria-label="Toggle store open/closed"
                    />
                </div>
                <button className="sidebar__logout" onClick={handleLogout}>
                    <HiOutlineLogout />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
