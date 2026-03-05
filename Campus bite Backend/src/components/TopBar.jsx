import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSearch, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';
import './TopBar.css';

const routeTitles = {
    '/store': 'Dashboard',
    '/store/orders': 'Live Orders',
    '/store/history': 'Order History',
    '/store/menu': 'Menu Management',
    '/store/payments': 'Payments',
    '/store/analytics': 'Analytics',
    '/store/settings': 'Settings',
};

export default function TopBar() {
    const location = useLocation();
    const { state } = useDashboard();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const title = routeTitles[location.pathname] || 'Dashboard';
    const storeConfig = state.storeConfig || {};
    const notifCount = (state.notifications || []).length;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="topbar">
            <div className="topbar__left">
                <h1 className="topbar__title">{title}</h1>
            </div>

            <div className="topbar__right">
                <div className="topbar__search">
                    <HiOutlineSearch className="topbar__search-icon" />
                    <input type="text" placeholder="Search orders, items..." />
                </div>

                <span className="topbar__role-badge topbar__role-badge--store">👨‍🍳 Store Owner</span>

                <button className="topbar__bell" aria-label="Notifications">
                    <HiOutlineBell />
                    {notifCount > 0 && <span className="topbar__bell-badge">{notifCount > 9 ? '9+' : notifCount}</span>}
                </button>

                <div className="topbar__avatar">
                    <div className="topbar__avatar-img">{storeConfig.ownerAvatar || '👨‍🍳'}</div>
                    <span className="topbar__avatar-name">{storeConfig.ownerName || 'Store Owner'}</span>
                </div>

                <button className="topbar__logout" onClick={handleLogout} aria-label="Logout">
                    <HiOutlineLogout />
                </button>
            </div>
        </header>
    );
}
