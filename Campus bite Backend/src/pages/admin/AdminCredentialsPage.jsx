import { useState, useEffect } from 'react';
import { apiAdminCredentialRequests, apiAdminResolveCredentialRequest } from '../../api';
import { HiOutlineKey, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock, HiOutlineClipboardCopy } from 'react-icons/hi';
import './AdminCredentialsPage.css';

export default function AdminCredentialsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState(null);
    const [createdCreds, setCreatedCreds] = useState(null);
    const [copied, setCopied] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await apiAdminCredentialRequests();
            setRequests(data);
        } catch (err) {
            setError(err.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            setResolvingId(id);
            const res = await apiAdminResolveCredentialRequest(id);
            if (res.status === 'resolved') {
                setCreatedCreds(res.credentials);
                // Refresh list
                fetchRequests();
            } else {
                alert(res.message);
                fetchRequests();
            }
        } catch (err) {
            alert(err.message || 'Failed to resolve request');
        } finally {
            setResolvingId(null);
        }
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };

    const handleCloseCredentials = () => {
        setCreatedCreds(null);
        setCopied('');
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="admin-credentials">
            <div className="admin-credentials__header">
                <h2>Credential Requests</h2>
                <p>Manage store owner requests for new login credentials.</p>
            </div>

            {error && <div className="admin-error">{error}</div>}

            <div className="admin-credentials__list">
                {loading ? (
                    <div className="admin-loading">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="admin-empty">
                        <HiOutlineKey />
                        <p>No credential requests found.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className={`admin-cred-card admin-cred-card--${req.status}`}>
                            <div className="admin-cred-card__header">
                                <h3>{req.storeName}</h3>
                                <div className={`admin-cred-status admin-cred-status--${req.status}`}>
                                    {req.status === 'pending' && <HiOutlineClock />}
                                    {req.status === 'resolved' && <HiOutlineCheckCircle />}
                                    {req.status === 'rejected' && <HiOutlineXCircle />}
                                    <span>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span>
                                </div>
                            </div>

                            <div className="admin-cred-card__details">
                                <div className="admin-cred-detail">
                                    <span className="label">Requested By:</span>
                                    <span className="value">{req.ownerName || 'Unknown Owner'}</span>
                                </div>
                                <div className="admin-cred-detail">
                                    <span className="label">Email:</span>
                                    <span className="value">{req.email}</span>
                                </div>
                                <div className="admin-cred-detail">
                                    <span className="label">Phone:</span>
                                    <span className="value">{req.phone}</span>
                                </div>
                                <div className="admin-cred-detail">
                                    <span className="label">Date:</span>
                                    <span className="value">{formatDate(req.createdAt)}</span>
                                </div>
                            </div>

                            {req.message && (
                                <div className="admin-cred-message">
                                    <strong>Message:</strong> {req.message}
                                </div>
                            )}

                            {req.status === 'pending' && (
                                <div className="admin-cred-card__actions">
                                    <button
                                        className="btn btn--primary"
                                        onClick={() => handleResolve(req.id)}
                                        disabled={resolvingId === req.id}
                                    >
                                        {resolvingId === req.id ? 'Generating...' : 'Generate New Credentials'}
                                    </button>
                                </div>
                            )}

                            {req.status !== 'pending' && req.adminResponse && (
                                <div className="admin-cred-response">
                                    <strong>Admin Response:</strong> {req.adminResponse}
                                    {req.resolvedAt && <span className="resolved-date"> (Resolved: {formatDate(req.resolvedAt)})</span>}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Generated Credentials Modal (Simulating Email) */}
            {createdCreds && (
                <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseCredentials()}>
                    <div className="admin-modal" style={{ maxWidth: 460 }}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <HiOutlineCheckCircle style={{ fontSize: 56, color: '#22C55E', margin: '0 auto' }} />
                            <h3 className="admin-modal__title" style={{ marginTop: 12 }}>Credentials Generated!</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginTop: 8, lineHeight: 1.5 }}>
                                The old password has been invalidated. In a production environment, an email would now be sent to the store owner with these details.
                            </p>
                        </div>

                        <div className="admin-cred-email-sim">
                            <div className="admin-cred-email-header">
                                📧 Simulated Email Output
                            </div>
                            <div className="admin-cred-email-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Username</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>{createdCreds.username}</div>
                                    </div>
                                    <button
                                        className="btn btn--secondary"
                                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                        onClick={() => handleCopy(createdCreds.username, 'username')}
                                    >
                                        {copied === 'username' ? '✓ Copied' : <><HiOutlineClipboardCopy /> Copy</>}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>New Password</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>{createdCreds.password}</div>
                                    </div>
                                    <button
                                        className="btn btn--secondary"
                                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                        onClick={() => handleCopy(createdCreds.password, 'password')}
                                    >
                                        {copied === 'password' ? '✓ Copied' : <><HiOutlineClipboardCopy /> Copy</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal__actions" style={{ justifyContent: 'center', marginTop: 24 }}>
                            <button className="btn btn--primary" onClick={handleCloseCredentials} style={{ minWidth: 120 }}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
