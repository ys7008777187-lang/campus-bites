import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoAdd, IoRemove, IoTrashOutline, IoCardOutline, IoWallet } from 'react-icons/io5';
import { fetchStore, placeOrder as apiPlaceOrder } from '../api';
import { useApp } from '../context/AppContext';
import './CartPage.css';

export default function CartPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [placedOrder, setPlacedOrder] = useState(null);

    const [store, setStore] = useState(null);

    useEffect(() => {
        if (state.cartStoreId) fetchStore(state.cartStoreId).then(setStore).catch(() => { });
    }, [state.cartStoreId]);
    const subtotal = state.cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    const handlePlaceOrder = async () => {
        if (state.cart.length === 0) return;
        setLoading(true);
        try {
            const order = await apiPlaceOrder({
                storeId: state.cartStoreId,
                items: state.cart.map(c => ({ name: c.name, qty: c.quantity, price: c.price, prepTime: c.prepTime })),
                paymentMethod,
                customerName: state.user?.name || 'Student',
            });
            dispatch({ type: 'ADD_ORDER', payload: order });
            setPlacedOrder(order);
            setOrderPlaced(true);
        } catch (err) {
            alert(err.message || 'Failed to place order');
        } finally { setLoading(false); }
    };

    const [loading, setLoading] = useState(false);

    if (orderPlaced) {
        const latestOrder = placedOrder;
        return (
            <div className="page cart-page cart-page--success">
                <div className="order-success animate-scale-in">
                    <span className="order-success__icon">🎉</span>
                    <h1 className="order-success__title">Order Placed!</h1>
                    <p className="order-success__sub">Your food is being prepared</p>

                    <div className="order-success__token">
                        <p className="order-success__token-label">Your OTP Token</p>
                        <p className="order-success__otp">{latestOrder?.otp || '----'}</p>
                        <p className="order-success__token-hint">Show this code at pickup counter</p>
                    </div>

                    <div className="order-success__details">
                        <p><strong>Order ID:</strong> {latestOrder?.id}</p>
                        <p><strong>Payment:</strong> {latestOrder?.paymentMethod === 'upi' ? 'UPI (Paid)' : 'Pay on Pickup'}</p>
                        <p><strong>Total:</strong> ₹{latestOrder?.total}</p>
                    </div>

                    <button className="btn btn--primary btn--full" onClick={() => navigate('/orders')}>
                        Track Order →
                    </button>
                    <button className="btn btn--secondary btn--full" onClick={() => navigate('/')} style={{ marginTop: '8px' }}>
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    if (state.cart.length === 0) {
        return (
            <div className="page cart-page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back"><IoArrowBack /></button>
                    <h1>Your Cart</h1>
                </div>
                <div className="empty-state">
                    <span className="empty-state__icon">🛒</span>
                    <p className="empty-state__title">Your cart is empty</p>
                    <p className="empty-state__text">Add items from a store to get started</p>
                    <button className="btn btn--primary" onClick={() => navigate('/')}>Explore Food Courts</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page cart-page">
            {/* Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back"><IoArrowBack /></button>
                <div>
                    <h1>Your Cart</h1>
                    {store && <p className="cart-store-name">from {store.name}</p>}
                </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
                {state.cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item__left">
                            <span className={`veg-dot ${!item.isVeg ? 'veg-dot--nonveg' : ''}`} />
                            <div>
                                <p className="cart-item__name">{item.name}</p>
                                <p className="cart-item__price">₹{item.price}</p>
                            </div>
                        </div>
                        <div className="cart-item__right">
                            <div className="cart-item__qty-ctrl">
                                <button
                                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                                    aria-label={`Decrease ${item.name}`}
                                >
                                    <IoRemove />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                                    aria-label={`Increase ${item.name}`}
                                >
                                    <IoAdd />
                                </button>
                            </div>
                            <p className="cart-item__subtotal">₹{item.price * item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Method */}
            <div className="cart-payment">
                <p className="section-label">Payment Method</p>
                <div className="cart-payment__options">
                    <button
                        className={`cart-payment__option ${paymentMethod === 'upi' ? 'cart-payment__option--active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                        aria-label="Pay with UPI"
                    >
                        <IoCardOutline className="cart-payment__icon" />
                        <span>UPI Payment</span>
                    </button>
                    <button
                        className={`cart-payment__option ${paymentMethod === 'pickup' ? 'cart-payment__option--active' : ''}`}
                        onClick={() => setPaymentMethod('pickup')}
                        aria-label="Pay on pickup"
                    >
                        <IoWallet className="cart-payment__icon" />
                        <span>Pay on Pickup</span>
                    </button>
                </div>

                {/* UPI App Quick Links */}
                {paymentMethod === 'upi' && (
                    <div className="upi-apps animate-slide-up">
                        <p className="upi-apps__label">Pay using</p>
                        <div className="upi-apps__grid">
                            {[
                                {
                                    name: 'PhonePe',
                                    scheme: 'phonepe://pay',
                                    color: '#5F259F',
                                    bg: '#F3EAFF',
                                    icon: (
                                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                                            <rect width="24" height="24" rx="6" fill="#5F259F" />
                                            <path d="M7.5 5.5h3l3.5 6v-6H17v13h-2.5l-4-6.5v6.5H7.5v-13z" fill="#fff" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: 'Google Pay',
                                    scheme: 'tez://upi/pay',
                                    color: '#4285F4',
                                    bg: '#E8F0FE',
                                    icon: (
                                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                                            <rect width="24" height="24" rx="6" fill="#fff" stroke="#E0E0E0" strokeWidth="0.5" />
                                            <path d="M18.5 12.2c0-.63-.06-1.25-.16-1.84H12v3.48h3.64a3.1 3.1 0 01-1.36 2.05v1.7h2.2c1.29-1.19 2.02-2.94 2.02-5.39z" fill="#4285F4" />
                                            <path d="M12 19c1.84 0 3.38-.6 4.51-1.64l-2.2-1.7c-.61.41-1.39.65-2.31.65-1.78 0-3.29-1.2-3.83-2.82H5.91v1.76A6.99 6.99 0 0012 19z" fill="#34A853" />
                                            <path d="M8.17 13.49a4.2 4.2 0 010-2.67V9.06H5.91A7 7 0 005 12c0 1.13.27 2.2.75 3.15l2.42-1.66z" fill="#FBBC05" />
                                            <path d="M12 7.58c1 0 1.9.34 2.6 1.02l1.96-1.96A7 7 0 0012 5a6.99 6.99 0 00-6.09 3.56l2.26 1.76c.54-1.62 2.05-2.74 3.83-2.74z" fill="#EA4335" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: 'Paytm',
                                    scheme: 'paytmmp://pay',
                                    color: '#00BAF2',
                                    bg: '#E0F7FE',
                                    icon: (
                                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                                            <rect width="24" height="24" rx="6" fill="#002970" />
                                            <path d="M4 10.5h2.5c1.1 0 2 .5 2 1.5s-.9 1.5-2 1.5H5.2v2H4v-5zm1.2 2.1h1.1c.6 0 .9-.2.9-.6s-.3-.6-.9-.6H5.2v1.2z" fill="#00BAF2" />
                                            <path d="M10 10.5h1.2v.7c.3-.5.9-.8 1.5-.8v1.2c-.9 0-1.5.4-1.5 1.2v2.7H10v-5z" fill="#00BAF2" />
                                            <path d="M15 10.5h4.5v1h-1.6v4H16.7v-4h-1.7v-1z" fill="#00BAF2" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: 'BHIM UPI',
                                    scheme: 'upi://pay',
                                    color: '#00B67A',
                                    bg: '#E8F8F0',
                                    icon: (
                                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                                            <rect width="24" height="24" rx="6" fill="#00B67A" />
                                            <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">UPI</text>
                                        </svg>
                                    ),
                                },
                            ].map(app => {
                                const upiUrl = `${app.scheme}?pa=campusbites@upi&pn=Campus Bites&am=${total}&cu=INR&tn=Order from ${store?.name || 'Campus Bites'}`;
                                return (
                                    <a
                                        key={app.name}
                                        href={upiUrl}
                                        className="upi-app-btn"
                                        style={{ '--upi-color': app.color, '--upi-bg': app.bg }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Pay with ${app.name}`}
                                    >
                                        <div className="upi-app-btn__icon">{app.icon}</div>
                                        <span className="upi-app-btn__name">{app.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                        <p className="upi-apps__hint">
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" style={{ flexShrink: 0 }}>
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Tap an app to open it directly with payment details pre-filled
                        </p>
                    </div>
                )}
            </div>

            {/* Bill Summary */}
            <div className="cart-bill">
                <p className="section-label">Bill Summary</p>
                <div className="cart-bill__row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="cart-bill__row"><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className="cart-bill__row cart-bill__row--total"><span>Total</span><span>₹{total}</span></div>
            </div>

            {/* Place Order */}
            <button className="btn btn--primary btn--full cart-place-btn" onClick={handlePlaceOrder}>
                Place Order — ₹{total}
            </button>
        </div>
    );
}
