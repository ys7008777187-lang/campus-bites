import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';

export default function AdminLayout() {
    return (
        <div className="dashboard-layout">
            <AdminSidebar />
            <div className="dashboard-main">
                <AdminTopBar />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
