import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSearch, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';
import './TopBar.css';

const routeTitles = {
    '/admin': 'Admin Dashboard',
    '/admin/stores': 'Store Management',
    '/admin/orders': 'All Orders',
    '/admin/fees': 'Platform Fees',
    '/admin/settings': 'Admin Settings',
};

export default function AdminTopBar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const title = routeTitles[location.pathname] || 'Admin Dashboard';

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
                    <input type="text" placeholder="Search stores, orders..." />
                </div>

                <span className="topbar__role-badge topbar__role-badge--admin">🛡️ Super Admin</span>

                <div className="topbar__avatar">
                    <div className="topbar__avatar-img">{user?.avatar || '🛡️'}</div>
                    <span className="topbar__avatar-name">{user?.name || 'Admin'}</span>
                </div>

                <button className="topbar__logout" onClick={handleLogout} aria-label="Logout">
                    <HiOutlineLogout />
                </button>
            </div>
        </header>
    );
}
