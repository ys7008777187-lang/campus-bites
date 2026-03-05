import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiGetMe, clearToken, connectDashWS, disconnectDashWS } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auto-login from stored token
    useEffect(() => {
        const token = localStorage.getItem('cb_dash_token');
        if (token) {
            apiGetMe()
                .then((u) => { setUser(u); connectDashWS(); })
                .catch(() => { clearToken(); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const data = await apiLogin(username, password);
            setUser(data.user);
            connectDashWS();
            return { success: true, role: data.user.role };
        } catch (err) {
            return { success: false, error: err.message || 'Invalid credentials' };
        }
    };

    const logout = () => {
        setUser(null);
        clearToken();
        disconnectDashWS();
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <span style={{ fontSize: '2rem' }}>🍕</span>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
