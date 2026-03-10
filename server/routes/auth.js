import { Router } from 'express';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { db } from '../db/database.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password, phone } = req.body;

    // Store owner / Super Admin login
    if (username && password) {
        const user = db.getUserByUsername(username);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = generateToken(user);
        return res.json({
            token,
            user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar, storeId: user.storeId, email: user.email },
        });
    }

    // Student login via phone
    if (phone) {
        // Static OTP for development — always 1234
        const otp = '1234';
        db.setConfig(`otp_${phone}`, otp);
        console.log(`📱 OTP for ${phone}: ${otp}`);
        return res.json({ message: 'OTP sent', phone });
    }

    return res.status(400).json({ error: 'Provide username/password or phone' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    const stored = db.getConfig(`otp_${phone}`);
    if (!stored || String(stored) !== String(otp)) {
        return res.status(401).json({ error: 'Invalid OTP' });
    }

    db.setConfig(`otp_${phone}`, null);

    let user = db.getUserByPhone(phone);
    if (!user) {
        const id = 'u-' + Date.now().toString(36);
        user = { id, phone, role: 'student', name: `User ${phone.slice(-4)}`, avatar: '👤' };
        db.addUser(user);
    }

    const token = generateToken(user);
    return res.json({
        token,
        user: { id: user.id, phone: user.phone, name: user.name, role: user.role, avatar: user.avatar },
    });
});

// GET /api/auth/me (auth middleware applied here directly)
router.get('/me', authMiddleware, (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    const user = db.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, phone: user.phone, name: user.name, role: user.role, avatar: user.avatar, storeId: user.storeId, email: user.email });
});

// POST /api/auth/credential-request (public — no auth needed)
router.post('/credential-request', (req, res) => {
    const { storeName, ownerName, email, phone, message } = req.body;
    if (!storeName || !phone || !email) {
        return res.status(400).json({ error: 'Store name, email, and phone number are required' });
    }
    const request = {
        id: 'CR-' + Date.now().toString(36).toUpperCase(),
        storeName,
        ownerName: ownerName || '',
        email,
        phone,
        message: message || 'Request for new credentials',
        createdAt: new Date().toISOString(),
    };
    db.addCredentialRequest(request);
    res.status(201).json({ message: 'Request submitted! Admin will review and generate new credentials for you.', id: request.id });
});

export default router;
