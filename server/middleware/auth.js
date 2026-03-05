import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'campus-bites-secret-key-2024';

export function generateToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role, storeId: user.store_id || null },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}
