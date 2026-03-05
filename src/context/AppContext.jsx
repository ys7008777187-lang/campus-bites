import { createContext, useContext, useReducer, useEffect } from 'react';
import { connectWebSocket, onWSMessage, disconnectWebSocket } from '../api';

const AppContext = createContext();

const initialState = {
    user: null,
    token: localStorage.getItem('cb_token') || null,
    cart: [],
    cartStoreId: null,
    orders: [],
    favoriteStoreIds: JSON.parse(localStorage.getItem('cb_favorites') || '[]'),
    fontScale: 1,
};

function reducer(state, action) {
    switch (action.type) {

        case 'ADD_TO_CART': {
            const item = action.payload;
            if (state.cartStoreId && state.cartStoreId !== item.storeId) {
                return { ...state, cart: [{ ...item, quantity: 1 }], cartStoreId: item.storeId };
            }
            const existing = state.cart.find(c => c.id === item.id);
            if (existing) {
                return { ...state, cart: state.cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
            }
            return { ...state, cart: [...state.cart, { ...item, quantity: 1 }], cartStoreId: item.storeId };
        }

        case 'REMOVE_FROM_CART': {
            const newCart = state.cart.filter(c => c.id !== action.payload);
            return { ...state, cart: newCart, cartStoreId: newCart.length ? state.cartStoreId : null };
        }

        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            if (quantity <= 0) {
                const newCart = state.cart.filter(c => c.id !== id);
                return { ...state, cart: newCart, cartStoreId: newCart.length ? state.cartStoreId : null };
            }
            return { ...state, cart: state.cart.map(c => c.id === id ? { ...c, quantity } : c) };
        }

        case 'CLEAR_CART':
            return { ...state, cart: [], cartStoreId: null };

        case 'SET_ORDERS':
            return { ...state, orders: action.payload };

        case 'ADD_ORDER':
            return { ...state, orders: [action.payload, ...state.orders], cart: [], cartStoreId: null };

        case 'UPDATE_ORDER_STATUS': {
            const { orderId, status, order } = action.payload;
            return {
                ...state,
                orders: state.orders.map(o => o.id === orderId ? { ...o, ...order, status } : o),
            };
        }

        case 'TOGGLE_FAVORITE': {
            const storeId = action.payload;
            const isFav = state.favoriteStoreIds.includes(storeId);
            const newFavs = isFav
                ? state.favoriteStoreIds.filter(id => id !== storeId)
                : [...state.favoriteStoreIds, storeId];
            localStorage.setItem('cb_favorites', JSON.stringify(newFavs));
            return { ...state, favoriteStoreIds: newFavs };
        }

        case 'SET_FONT_SCALE':
            return { ...state, fontScale: action.payload };

        case 'LOGIN':
            return { ...state, user: action.payload.user, token: action.payload.token };

        case 'LOGOUT':
            localStorage.removeItem('cb_token');
            return { ...state, user: null, token: null };

        case 'REORDER':
            return { ...state, cart: action.payload.items.map(item => ({ ...item })), cartStoreId: action.payload.storeId };

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Connect WebSocket when user logs in
    useEffect(() => {
        if (state.user) {
            connectWebSocket();
            const unsub = onWSMessage((data) => {
                if (data.type === 'ORDER_STATUS_UPDATE') {
                    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: data });
                }
            });
            return () => { unsub(); disconnectWebSocket(); };
        }
    }, [state.user]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
