import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiSubmitCredentialRequest } from '../api';
import './LoginPage.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Forgot credentials modal state
    const [showForgot, setShowForgot] = useState(false);
    const [forgotData, setForgotData] = useState({ storeName: '', ownerName: '', email: '', phone: '', message: '' });
    const [forgotStatus, setForgotStatus] = useState(''); // '', 'sending', 'sent', 'error'
    const [forgotMessage, setForgotMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password);
        if (result.success) {
            navigate(result.role === 'super_admin' ? '/admin' : '/store');
        } else {
            setError(result.error);
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotData.storeName || !forgotData.phone || !forgotData.email) {
            setForgotMessage('Store name, email, and phone number are required');
            setForgotStatus('error');
            return;
        }
        setForgotStatus('sending');
        try {
            const res = await apiSubmitCredentialRequest(forgotData);
            setForgotStatus('sent');
            setForgotMessage(res.message);
        } catch (err) {
            setForgotStatus('error');
            setForgotMessage(err.message || 'Failed to submit request');
        }
    };

    const closeForgotModal = () => {
        setShowForgot(false);
        setForgotData({ storeName: '', ownerName: '', phone: '', message: '' });
        setForgotStatus('');
        setForgotMessage('');
    };

    return (
        <div className="login-page">
            <div className="login-page__blob login-page__blob--1" />
            <div className="login-page__blob login-page__blob--2" />
            <div className="login-page__blob login-page__blob--3" />

            <div className="login-card">
                <div className="login-card__brand">
                    <span className="login-card__logo">🍔</span>
                    <h1 className="login-card__title">Campus Bites</h1>
                    <p className="login-card__subtitle">Store Dashboard · Sign In</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="login-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>

                <button className="forgot-link" onClick={() => setShowForgot(true)}>
                    🔑 Forgot Username or Password?
                </button>

                <div className="login-hint">
                    <div className="login-hint__title">Demo Credentials</div>
                    <div className="login-hint__row">
                        <span className="login-hint__role">🛡️ Super Admin</span>
                        <span className="login-hint__creds">admin / admin123</span>
                    </div>
                    <div className="login-hint__row">
                        <span className="login-hint__role">👨‍🍳 Store Owner</span>
                        <span className="login-hint__creds">store / store123</span>
                    </div>
                </div>
            </div>

            {/* Forgot Credentials Modal */}
            {showForgot && (
                <div className="modal-overlay" onClick={closeForgotModal}>
                    <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>🔑 Forgot Credentials</h2>
                        <p className="forgot-modal__desc">
                            Submit a request to the admin. They will generate new login credentials for your store.
                        </p>

                        {forgotStatus === 'sent' ? (
                            <div className="forgot-modal__success">
                                <div className="forgot-modal__success-icon">✅</div>
                                <p>{forgotMessage}</p>
                                <button className="login-btn" onClick={closeForgotModal}>Done</button>
                            </div>
                        ) : (
                            <form className="forgot-form" onSubmit={handleForgotSubmit}>
                                <div className="login-field">
                                    <label>Store Name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Pizza Planet"
                                        value={forgotData.storeName}
                                        onChange={(e) => setForgotData({ ...forgotData, storeName: e.target.value })}
                                    />
                                </div>
                                <div className="login-field">
                                    <label>Owner Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={forgotData.ownerName}
                                        onChange={(e) => setForgotData({ ...forgotData, ownerName: e.target.value })}
                                    />
                                </div>
                                <div className="login-field">
                                    <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="email"
                                        placeholder="store@example.com"
                                        value={forgotData.email}
                                        onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                                    />
                                </div>
                                <div className="login-field">
                                    <label>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={forgotData.phone}
                                        onChange={(e) => setForgotData({ ...forgotData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="login-field">
                                    <label>Message (optional)</label>
                                    <textarea
                                        placeholder="Any additional info..."
                                        value={forgotData.message}
                                        onChange={(e) => setForgotData({ ...forgotData, message: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                {forgotStatus === 'error' && (
                                    <div className="login-error">{forgotMessage}</div>
                                )}

                                <div className="forgot-modal__actions">
                                    <button type="button" className="forgot-modal__cancel" onClick={closeForgotModal}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="login-btn" disabled={forgotStatus === 'sending'}>
                                        {forgotStatus === 'sending' ? 'Sending...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
