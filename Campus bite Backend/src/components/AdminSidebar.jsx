import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineShoppingBag,
    HiOutlineCurrencyRupee,
    HiOutlineCog,
    HiOutlineKey,
    HiOutlineLogout,
} from 'react-icons/hi';
import './AdminSidebar.css';

const navItems = [
    { path: '/admin', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/admin/stores', icon: HiOutlineOfficeBuilding, label: 'Stores', badgeKey: 'stores' },
    { path: '/admin/orders', icon: HiOutlineShoppingBag, label: 'All Orders' },
    { path: '/admin/fees', icon: HiOutlineCurrencyRupee, label: 'Platform Fees' },
    { path: '/admin/credentials', icon: HiOutlineKey, label: 'Credential Requests' },
    { path: '/admin/settings', icon: HiOutlineCog, label: 'Settings' },
];

export default function AdminSidebar() {
    const { state } = useAdmin();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__brand">
                <div className="admin-sidebar__logo">🛡️</div>
                <div className="admin-sidebar__brand-text">
                    <h3>Campus Bites</h3>
                    <span>Super Admin</span>
                </div>
            </div>

            <nav className="admin-sidebar__nav">
                {navItems.map(({ path, icon: Icon, label, badgeKey }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/admin'}
                        className={({ isActive }) => `admin-sidebar__link ${isActive ? 'active' : ''}`}
                    >
                        <span className="admin-sidebar__link-icon"><Icon /></span>
                        <span>{label}</span>
                        {badgeKey === 'stores' && (
                            <span className="admin-sidebar__link-badge">{state.stores.length}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="admin-sidebar__footer">
                <button className="admin-sidebar__logout" onClick={handleLogout}>
                    <HiOutlineLogout />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
