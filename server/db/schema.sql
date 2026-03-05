-- Campus Bites Database Schema

CREATE TABLE IF NOT EXISTS food_courts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    description TEXT,
    is_open INTEGER DEFAULT 1,
    open_time TEXT,
    close_time TEXT
);

CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    court_id TEXT REFERENCES food_courts(id),
    name TEXT NOT NULL,
    image TEXT,
    cuisine TEXT,
    description TEXT,
    rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    prep_time TEXT,
    is_open INTEGER DEFAULT 0,
    owner_name TEXT,
    owner_avatar TEXT,
    phone TEXT,
    upi_id TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone TEXT UNIQUE,
    username TEXT UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    name TEXT,
    avatar TEXT,
    store_id TEXT REFERENCES stores(id),
    email TEXT
);

CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    store_id TEXT REFERENCES stores(id),
    name TEXT NOT NULL,
    category TEXT,
    price REAL NOT NULL,
    prep_time INTEGER,
    is_veg INTEGER DEFAULT 1,
    image TEXT,
    description TEXT,
    is_available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    store_id TEXT REFERENCES stores(id),
    store_name TEXT,
    customer_name TEXT,
    items_json TEXT,
    total REAL NOT NULL,
    status TEXT DEFAULT 'new',
    payment_method TEXT,
    otp TEXT,
    placed_at TEXT,
    estimated_ready TEXT,
    completed_at TEXT,
    rejected_reason TEXT
);

CREATE TABLE IF NOT EXISTS platform_config (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS fee_settlements (
    id TEXT PRIMARY KEY,
    store_id TEXT REFERENCES stores(id),
    amount REAL,
    status TEXT DEFAULT 'pending',
    period_start TEXT,
    period_end TEXT,
    settled_at TEXT
);

CREATE TABLE IF NOT EXISTS credential_requests (
    id TEXT PRIMARY KEY,
    store_name TEXT NOT NULL,
    owner_name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    admin_response TEXT,
    new_username TEXT,
    new_password TEXT,
    created_at TEXT,
    resolved_at TEXT
);
