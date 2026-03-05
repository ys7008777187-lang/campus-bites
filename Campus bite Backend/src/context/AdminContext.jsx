import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    apiAdminDashboard, apiAdminStores, apiAdminToggleStore,
    apiAdminAddStore, apiAdminRemoveStore, apiAdminUpdateStore,
    onDashWSMessage,
} from '../api';

const AdminContext = createContext(null);

const initialState = {
    stores: [],
    orders: [],
    analytics: null,
    dashboardData: null,
    notifications: [],
    loading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                stores: action.payload.stores || state.stores,
                orders: action.payload.orders || state.orders,
                analytics: action.payload.analytics || state.analytics,
                dashboardData: action.payload.dashboardData || state.dashboardData,
                loading: false,
            };

        case 'SET_STORES':
            return { ...state, stores: action.payload };

        case 'TOGGLE_STORE_STATUS':
            return {
                ...state,
                stores: state.stores.map(s =>
                    s.id === action.payload.id ? { ...s, isOpen: action.payload.isOpen } : s
                ),
                notifications: [
                    { id: Date.now(), type: 'info', message: action.payload.message },
                    ...state.notifications,
                ],
            };

        case 'ADD_STORE':
            return {
                ...state,
                stores: [...state.stores, action.payload],
                notifications: [
                    { id: Date.now(), type: 'success', message: `${action.payload.name} added successfully` },
                    ...state.notifications,
                ],
            };

        case 'REMOVE_STORE':
            return {
                ...state,
                stores: state.stores.filter(s => s.id !== action.payload),
                notifications: [
                    { id: Date.now(), type: 'warning', message: 'Store removed' },
                    ...state.notifications,
                ],
            };

        case 'UPDATE_STORE':
            return {
                ...state,
                stores: state.stores.map(s =>
                    s.id === action.payload.id ? { ...s, ...action.payload.changes } : s
                ),
            };

        case 'DISMISS_NOTIFICATION':
            return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };

        default:
            return state;
    }
}

export function AdminProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user } = useAuth();

    // Load admin data
    useEffect(() => {
        if (user?.role !== 'super_admin') {
            dispatch({ type: 'SET_DATA', payload: {} });
            return;
        }
        async function load() {
            try {
                const [dashboard, stores] = await Promise.all([apiAdminDashboard(), apiAdminStores()]);
                dispatch({ type: 'SET_DATA', payload: { dashboardData: dashboard, stores } });
            } catch (err) {
                console.error('Failed to load admin data:', err);
                dispatch({ type: 'SET_DATA', payload: {} });
            }
        }
        load();
    }, [user?.role]);

    // WebSocket: listen for store/order changes
    useEffect(() => {
        const unsub = onDashWSMessage((msg) => {
            if (msg.type === 'STORE_STATUS_CHANGE') {
                dispatch({ type: 'TOGGLE_STORE_STATUS', payload: { id: msg.storeId, isOpen: msg.isOpen, message: `${msg.storeName} is now ${msg.isOpen ? 'open' : 'closed'}` } });
            }
            if (msg.type === 'STORE_ADDED') {
                dispatch({ type: 'ADD_STORE', payload: msg.store });
            }
            if (msg.type === 'STORE_REMOVED') {
                dispatch({ type: 'REMOVE_STORE', payload: msg.storeId });
            }
        });
        return unsub;
    }, []);

    // Wrap dispatch with API calls
    const apiDispatch = async (action) => {
        switch (action.type) {
            case 'TOGGLE_STORE_STATUS': {
                try {
                    const res = await apiAdminToggleStore(action.payload);
                    dispatch({ type: 'TOGGLE_STORE_STATUS', payload: { id: res.id, isOpen: res.isOpen, message: `${res.name} is now ${res.isOpen ? 'open' : 'closed'}` } });
                } catch (err) {
                    console.error('Toggle failed:', err);
                }
                break;
            }
            case 'ADD_STORE': {
                try {
                    const result = await apiAdminAddStore(action.payload);
                    // API returns { store, credentials }
                    dispatch({ type: 'ADD_STORE', payload: result.store || result });
                    return result; // Return so page can show credentials
                } catch (err) {
                    console.error('Add store failed:', err);
                }
                break;
            }
            case 'REMOVE_STORE': {
                try {
                    await apiAdminRemoveStore(action.payload);
                    dispatch({ type: 'REMOVE_STORE', payload: action.payload });
                } catch (err) {
                    console.error('Remove store failed:', err);
                }
                break;
            }
            case 'UPDATE_STORE': {
                try {
                    await apiAdminUpdateStore(action.payload.id, action.payload.changes);
                    dispatch(action);
                } catch (err) {
                    console.error('Update store failed:', err);
                }
                break;
            }
            default:
                dispatch(action);
        }
    };

    return (
        <AdminContext.Provider value={{ state, dispatch: apiDispatch }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
    return ctx;
}
