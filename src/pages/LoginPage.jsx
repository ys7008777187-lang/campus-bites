import { useState, useRef, useEffect } from 'react';
import { IoPhonePortrait, IoShieldCheckmark, IoArrowForward } from 'react-icons/io5';
import { loginWithPhone, verifyOTP } from '../api';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [step, setStep] = useState('phone'); // phone | otp
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpRefs = [useRef(), useRef(), useRef(), useRef()];

    // Countdown for resend
    useEffect(() => {
        if (timer <= 0) return;
        const id = setTimeout(() => setTimer(t => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timer]);

    const handleSendOTP = async () => {
        const cleaned = phone.replace(/\s/g, '');
        if (!/^[6-9]\d{9}$/.test(cleaned)) {
            setError('Enter a valid 10-digit mobile number');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await loginWithPhone(cleaned);
            if (res.simulatedOtp) {
                alert(`📱 Dev Mode:\nYour OTP is: ${res.simulatedOtp}\n(SMS service unavailable, showing OTP here)`);
            }
            setStep('otp');
            setTimer(30);
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 4) {
            setError('Enter the 4-digit OTP');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const cleaned = phone.replace(/\s/g, '');
            const data = await verifyOTP(cleaned, code);
            onLogin({ user: data.user, token: data.token });
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        if (timer > 0) return;
        setOtp(['', '', '', '']);
        setError('');
        handleSendOTP();
    };

    return (
        <div className="login-page">
            {/* Background decoration */}
            <div className="login-bg">
                <div className="login-bg__circle login-bg__circle--1" />
                <div className="login-bg__circle login-bg__circle--2" />
                <div className="login-bg__circle login-bg__circle--3" />
            </div>

            <div className="login-content">
                {/* Logo */}
                <div className="login-logo">
                    <span className="login-logo__emoji">🍕</span>
                    <h1 className="login-logo__title">Campus Bites</h1>
                    <p className="login-logo__tagline">Order food, skip the queue</p>
                </div>

                {/* Phone Step */}
                {step === 'phone' && (
                    <div className="login-card animate-slide-up">
                        <div className="login-card__icon-wrap">
                            <IoPhonePortrait className="login-card__icon" />
                        </div>
                        <h2 className="login-card__title">Enter your mobile number</h2>
                        <p className="login-card__sub">We'll send you a 4-digit OTP to verify</p>

                        <div className="login-phone-field">
                            <span className="login-phone-field__prefix">+91</span>
                            <input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={e => { setPhone(e.target.value); setError(''); }}
                                placeholder="98765 43210"
                                className="login-phone-field__input"
                                aria-label="Mobile number"
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                            />
                        </div>

                        {error && <p className="login-error">{error}</p>}

                        <button
                            className="btn btn--primary btn--full login-submit"
                            onClick={handleSendOTP}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="login-spinner" />
                            ) : (
                                <>Send OTP <IoArrowForward /></>
                            )}
                        </button>

                        <p className="login-terms">
                            By continuing, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
                        </p>
                    </div>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <div className="login-card animate-slide-up">
                        <div className="login-card__icon-wrap login-card__icon-wrap--green">
                            <IoShieldCheckmark className="login-card__icon" />
                        </div>
                        <h2 className="login-card__title">Verify OTP</h2>
                        <p className="login-card__sub">
                            Sent to <strong>+91 {phone}</strong>
                            <button className="login-change-btn" onClick={() => setStep('phone')}>Change</button>
                        </p>

                        <div className="login-otp-boxes">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={otpRefs[i]}
                                    type="tel"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOTPChange(i, e.target.value)}
                                    onKeyDown={e => handleOTPKeyDown(i, e)}
                                    className={`login-otp-box ${digit ? 'login-otp-box--filled' : ''}`}
                                    aria-label={`OTP digit ${i + 1}`}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        {error && <p className="login-error">{error}</p>}

                        <button
                            className="btn btn--primary btn--full login-submit"
                            onClick={handleVerify}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="login-spinner" />
                            ) : (
                                <>Verify & Continue <IoArrowForward /></>
                            )}
                        </button>

                        <p className="login-resend">
                            {timer > 0 ? (
                                <>Resend OTP in <strong>{timer}s</strong></>
                            ) : (
                                <button className="login-resend-btn" onClick={handleResend}>Resend OTP</button>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
