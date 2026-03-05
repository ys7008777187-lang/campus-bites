import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoTime, IoCheckmarkCircle, IoRestaurant, IoRefresh, IoReceipt, IoStorefront, IoChevronForward } from 'react-icons/io5';
import { useApp } from '../context/AppContext';
import { fetchOrders } from '../api';
import './OrdersPage.css';

function CountdownTimer({ targetTime }) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const update = () => {
            const diff = new Date(targetTime) - new Date();
            if (diff <= 0) {
                setTimeLeft('Ready!');
                setIsUrgent(false);
                return;
            }
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
            setIsUrgent(mins < 2);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <div className={`countdown-chip ${isUrgent ? 'countdown-chip--urgent' : ''}`}>
            <IoTime className="countdown-chip__icon" />
            <span className="countdown-chip__time">{timeLeft}</span>
        </div>
    );
}

function LiveDot() {
    return <span className="live-dot" aria-label="Live" />;
}

const statusConfig = {
    new: { label: 'Order Placed', icon: IoReceipt, color: 'blue', step: 0 },
    placed: { label: 'Order Placed', icon: IoReceipt, color: 'blue', step: 0 },
    preparing: { label: 'Preparing', icon: IoRestaurant, color: 'orange', step: 1 },
    ready: { label: 'Ready for Pickup', icon: IoCheckmarkCircle, color: 'green', step: 2 },
    picked: { label: 'Completed', icon: IoCheckmarkCircle, color: 'gray', step: 3 },
};

const stepLabels = ['Placed', 'Preparing', 'Ready'];

export default function OrdersPage() {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();
    const [tab, setTab] = useState('active');
    const [loading, setLoading] = useState(true);

    // Fetch orders from API on mount
    useEffect(() => {
        if (state.user?.id) {
            fetchOrders(state.user.id).then(orders => {
                dispatch({ type: 'SET_ORDERS', payload: orders });
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const activeOrders = state.orders.filter(o => ['new', 'placed', 'preparing', 'ready'].includes(o.status));
    const pastOrders = state.orders.filter(o => o.status === 'completed' || o.status === 'picked' || o.status === 'rejected');

    return (
        <div className="page orders-page">
            {/* Header */}
            <div className="orders-header">
                <h1 className="orders-header__title">My Orders</h1>
                {activeOrders.length > 0 && (
                    <div className="orders-header__live">
                        <LiveDot /> {activeOrders.length} active
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="orders-tabs" role="tablist">
                <button
                    role="tab"
                    aria-selected={tab === 'active'}
                    className={`orders-tab ${tab === 'active' ? 'orders-tab--active' : ''}`}
                    onClick={() => setTab('active')}
                >
                    <IoRestaurant className="orders-tab__icon" />
                    <span>Active</span>
                    {activeOrders.length > 0 && <span className="orders-tab__count">{activeOrders.length}</span>}
                </button>
                <button
                    role="tab"
                    aria-selected={tab === 'history'}
                    className={`orders-tab ${tab === 'history' ? 'orders-tab--active' : ''}`}
                    onClick={() => setTab('history')}
                >
                    <IoTime className="orders-tab__icon" />
                    <span>History</span>
                    {pastOrders.length > 0 && <span className="orders-tab__count">{pastOrders.length}</span>}
                </button>
            </div>

            {/* Active Orders */}
            {tab === 'active' && (
                <div className="orders-list">
                    {activeOrders.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state__illustration">
                                <span className="empty-state__icon">🍽️</span>
                            </div>
                            <p className="empty-state__title">No active orders</p>
                            <p className="empty-state__text">Feeling hungry? Your next order is just a tap away!</p>
                            <button className="btn btn--primary" onClick={() => navigate('/')}>
                                Explore Menus
                            </button>
                        </div>
                    )}
                    {activeOrders.map(order => {
                        const config = statusConfig[order.status];
                        const StatusIcon = config.icon;
                        return (
                            <div key={order.id} className={`order-card order-card--${config.color}`}>
                                {/* Top: Store + Status */}
                                <div className="order-card__top">
                                    <div className="order-card__store-info">
                                        <div className="order-card__store-icon">
                                            <IoStorefront />
                                        </div>
                                        <div>
                                            <h3 className="order-card__store-name">{order.storeName}</h3>
                                            <span className="order-card__id">{order.id}</span>
                                        </div>
                                    </div>
                                    <div className={`order-card__status-badge order-card__status-badge--${config.color}`}>
                                        <StatusIcon />
                                        <span>{config.label}</span>
                                    </div>
                                </div>

                                {/* Stepper */}
                                <div className="order-stepper">
                                    {stepLabels.map((label, idx) => (
                                        <div key={label} className="order-stepper__segment">
                                            <div className={`order-stepper__step ${config.step >= idx + 1 ? 'order-stepper__step--done' : ''} ${config.step === idx ? 'order-stepper__step--current' : ''}`}>
                                                <span className="order-stepper__dot">
                                                    {config.step >= idx + 1 && <IoCheckmarkCircle className="order-stepper__check" />}
                                                </span>
                                                <span className="order-stepper__label">{label}</span>
                                            </div>
                                            {idx < stepLabels.length - 1 && (
                                                <div className={`order-stepper__line ${config.step > idx + 1 ? 'order-stepper__line--done' : config.step === idx + 1 ? 'order-stepper__line--active' : ''}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Items */}
                                <div className="order-card__items">
                                    {order.items.map(item => (
                                        <div key={item.id} className="order-card__item-row">
                                            <span className="order-card__item-qty">{item.quantity}×</span>
                                            <span className="order-card__item-name">{item.name}</span>
                                            <span className="order-card__item-price">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom: OTP + Action */}
                                <div className="order-card__bottom">
                                    <div className="order-card__otp">
                                        <span className="order-card__otp-label">Pickup OTP</span>
                                        <div className="order-card__otp-digits">
                                            {order.otp.split('').map((d, i) => (
                                                <span key={i} className="order-card__otp-digit">{d}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="order-card__action">
                                        {order.status === 'preparing' && (
                                            <CountdownTimer targetTime={order.estimatedReady} />
                                        )}
                                        {order.status === 'ready' && (
                                            <button
                                                className="btn btn--primary btn--sm order-card__pickup-btn"
                                                onClick={() => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: 'picked' } })}
                                            >
                                                ✅ Mark Picked
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="order-card__total-bar">
                                    <span>Total</span>
                                    <span className="order-card__total-amount">₹{order.total}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* History */}
            {tab === 'history' && (
                <div className="orders-list">
                    {pastOrders.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state__illustration">
                                <span className="empty-state__icon">📜</span>
                            </div>
                            <p className="empty-state__title">No past orders</p>
                            <p className="empty-state__text">Your completed orders will show up here</p>
                        </div>
                    )}
                    {pastOrders.map(order => (
                        <div key={order.id} className="history-card card">
                            <div className="history-card__top">
                                <div className="history-card__store">
                                    <div className="history-card__store-icon">
                                        <IoStorefront />
                                    </div>
                                    <div>
                                        <h3 className="history-card__store-name">{order.storeName}</h3>
                                        <p className="history-card__date">
                                            {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <span className="history-card__badge">✓ Delivered</span>
                            </div>

                            <div className="history-card__items">
                                {order.items.map(item => (
                                    <span key={item.id} className="history-card__item-pill">
                                        {item.quantity}× {item.name}
                                    </span>
                                ))}
                            </div>

                            <div className="history-card__bottom">
                                <span className="history-card__total">₹{order.total}</span>
                                <button
                                    className="history-card__reorder-btn"
                                    onClick={() => {
                                        dispatch({ type: 'REORDER', payload: order });
                                        navigate('/cart');
                                    }}
                                >
                                    <IoRefresh /> Reorder
                                    <IoChevronForward className="history-card__arrow" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
