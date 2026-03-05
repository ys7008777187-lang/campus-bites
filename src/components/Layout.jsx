import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useApp } from '../context/AppContext';

export default function Layout() {
    const { state } = useApp();

    return (
        <div style={{ '--font-scale': state.fontScale }}>
            <a href="#main-content" className="skip-link">Skip to content</a>
            <main id="main-content">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
