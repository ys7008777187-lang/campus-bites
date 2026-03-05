import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    apiGetStore, apiGetMenu, apiGetStoreOrders, apiUpdateOrderStatus,
    apiUpdateMenuItem, apiAddMenuItem, apiUpdateStore,
    onDashWSMessage,
} from '../api';

const DashboardContext = createContext(null);

const initialState = {
    orders: [],
    menuItems: [],
    storeConfig: null,
    notifications: [],
    loading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_INITIAL_DATA':
            return {
                ...state,
                orders: action.payload.orders || [],
                menuItems: action.payload.menuItems || [],
                storeConfig: action.payload.storeConfig || null,
                loading: false,
            };

        case 'SET_ORDERS':
            return { ...state, orders: action.payload };

        case 'UPDATE_ORDER': {
            const updated = action.payload;
            const exists = state.orders.find(o => o.id === updated.id);
            return {
                ...state,
                orders: exists
                    ? state.orders.map(o => o.id === updated.id ? { ...o, ...updated } : o)
                    : [updated, ...state.orders],
            };
        }

        case 'ACCEPT_ORDER':
        case 'REJECT_ORDER':
        case 'MARK_READY':
        case 'COMPLETE_ORDER':
            return {
                ...state,
                orders: state.orders.map(o =>
                    o.id === action.payload.id ? { ...o, ...action.payload.changes } : o
                ),
                notifications: [
                    { id: Date.now(), type: action.payload.notifType || 'success', message: action.payload.message },
                    ...state.notifications,
                ],
            };

        case 'TOGGLE_ITEM_AVAILABILITY':
            return {
                ...state,
                menuItems: state.menuItems.map(item =>
                    item.id === action.payload ? { ...item, isAvailable: !item.isAvailable } : item
                ),
            };

        case 'UPDATE_ITEM':
            return {
                ...state,
                menuItems: state.menuItems.map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload.changes } : item
                ),
            };

        case 'ADD_ITEM':
            return { ...state, menuItems: [...state.menuItems, action.payload] };

        case 'TOGGLE_STORE':
            return {
                ...state,
                storeConfig: { ...state.storeConfig, isOpen: !state.storeConfig?.isOpen },
                notifications: [
                    { id: Date.now(), type: 'info', message: `Store is now ${state.storeConfig?.isOpen ? 'closed' : 'open'}` },
                    ...state.notifications,
                ],
            };

        case 'UPDATE_STORE':
            return { ...state, storeConfig: { ...state.storeConfig, ...action.payload } };

        case 'DISMISS_NOTIFICATION':
            return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };

        default:
            return state;
    }
}

export function DashboardProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user } = useAuth();

    // Load store data from API
    useEffect(() => {
        if (!user?.storeId) {
            dispatch({ type: 'SET_INITIAL_DATA', payload: { loading: false } });
            return;
        }
        async function load() {
            try {
                const [store, menu, orders] = await Promise.all([
                    apiGetStore(user.storeId),
                    apiGetMenu(user.storeId),
                    apiGetStoreOrders(user.storeId),
                ]);
                dispatch({ type: 'SET_INITIAL_DATA', payload: { storeConfig: store, menuItems: menu, orders } });
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                dispatch({ type: 'SET_INITIAL_DATA', payload: {} });
            }
        }
        load();
    }, [user?.storeId]);

    // WebSocket: listen for new orders & status updates
    useEffect(() => {
        const unsub = onDashWSMessage((msg) => {
            if (msg.type === 'NEW_ORDER' && msg.storeId === user?.storeId) {
                dispatch({ type: 'UPDATE_ORDER', payload: msg.order });
            }
            if (msg.type === 'ORDER_STATUS_UPDATE' && msg.storeId === user?.storeId) {
                dispatch({ type: 'UPDATE_ORDER', payload: msg.order });
            }
        });
        return unsub;
    }, [user?.storeId]);

    // Wrap dispatch with API calls for order actions
    const apiDispatch = async (action) => {
        switch (action.type) {
            case 'ACCEPT_ORDER': {
                const res = await apiUpdateOrderStatus(action.payload, { status: 'preparing' });
                dispatch({ type: 'ACCEPT_ORDER', payload: { id: action.payload, changes: res, notifType: 'success', message: `Order ${action.payload} accepted` } });
                break;
            }
            case 'REJECT_ORDER': {
                const res = await apiUpdateOrderStatus(action.payload.id, { status: 'rejected', reason: action.payload.reason });
                dispatch({ type: 'REJECT_ORDER', payload: { id: action.payload.id, changes: res, notifType: 'warning', message: `Order ${action.payload.id} rejected` } });
                break;
            }
            case 'MARK_READY': {
                const res = await apiUpdateOrderStatus(action.payload, { status: 'ready' });
                dispatch({ type: 'MARK_READY', payload: { id: action.payload, changes: res, notifType: 'info', message: `Order ${action.payload} ready for pickup` } });
                break;
            }
            case 'COMPLETE_ORDER': {
                const res = await apiUpdateOrderStatus(action.payload, { status: 'completed' });
                dispatch({ type: 'COMPLETE_ORDER', payload: { id: action.payload, changes: res, notifType: 'success', message: `Order ${action.payload} completed!` } });
                break;
            }
            case 'TOGGLE_ITEM_AVAILABILITY': {
                const item = state.menuItems.find(m => m.id === action.payload);
                if (item && user?.storeId) {
                    await apiUpdateMenuItem(user.storeId, action.payload, { isAvailable: !item.isAvailable });
                }
                dispatch(action);
                break;
            }
            case 'UPDATE_ITEM': {
                if (user?.storeId) await apiUpdateMenuItem(user.storeId, action.payload.id, action.payload.changes);
                dispatch(action);
                break;
            }
            case 'ADD_ITEM': {
                if (user?.storeId) {
                    const created = await apiAddMenuItem(user.storeId, action.payload);
                    dispatch({ type: 'ADD_ITEM', payload: created });
                } else {
                    dispatch(action);
                }
                break;
            }
            case 'TOGGLE_STORE': {
                if (user?.storeId) {
                    await apiUpdateStore(user.storeId, { isOpen: !state.storeConfig?.isOpen });
                }
                dispatch(action);
                break;
            }
            case 'UPDATE_STORE': {
                if (user?.storeId) await apiUpdateStore(user.storeId, action.payload);
                dispatch(action);
                break;
            }
            default:
                dispatch(action);
        }
    };

    return (
        <DashboardContext.Provider value={{ state, dispatch: apiDispatch }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
    return ctx;
}
