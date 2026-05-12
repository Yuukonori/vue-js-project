-- PostgreSQL Schema

-- 1. Expiring Assets (List View)
CREATE TABLE IF NOT EXISTS expiring_assets (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50), -- laptop, router, printer
    name VARCHAR(255),
    expiry_label VARCHAR(100)
);

-- 2. Recent Repair Tickets (Table View)
CREATE TABLE IF NOT EXISTS repair_tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50),
    priority VARCHAR(20),
    subject VARCHAR(255),
    asset_tag VARCHAR(100),
    description TEXT,
    status VARCHAR(50), -- IN PROGRESS, RESOLVED, PENDING, URGENT
    updated_at DATE
);

-- 3. Asset Inventory (Detailed Table View)
CREATE TABLE IF NOT EXISTS inventory (
    asset_id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50), -- Laptop, Monitor, Tablet, Mobile
    serial_number VARCHAR(100),
    service_years DECIMAL(3,1),
    purchase_date DATE,
    warranty_expiry DATE,
    status VARCHAR(50), -- ASSIGNED, AVAILABLE, MAINTENANCE
    assigned_user_id INTEGER
);

-- 4. Real-time Activity Feed (List View)
CREATE TABLE IF NOT EXISTS activity_feed (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50), -- login, update, logout
    title VARCHAR(255),
    description TEXT,
    time_label VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Critical Maintenance (Action Table View)
CREATE TABLE IF NOT EXISTS maintenance (
    asset_id VARCHAR(50) PRIMARY KEY,
    issue VARCHAR(255),
    priority VARCHAR(50), -- CRITICAL, HIGH, MEDIUM
    action_text VARCHAR(100)
);

-- 6. Ongoing Repairs (Cards)
CREATE TABLE IF NOT EXISTS ongoing_repairs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    severity VARCHAR(50),
    elapsed VARCHAR(50),
    action_label VARCHAR(50)
);

-- 7. Service History (Table)
CREATE TABLE IF NOT EXISTS service_history (
    asset_id VARCHAR(50) PRIMARY KEY,
    asset_name VARCHAR(255),
    failure_frequency VARCHAR(255),
    last_service DATE,
    condition VARCHAR(50),
    status_icon VARCHAR(50)
);

-- 8. Audit Logs (Log Table)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP,
    user_identity VARCHAR(255),
    description TEXT,
    ip_address VARCHAR(50),
    status VARCHAR(50)
);

-- Problem Frequency Stats
CREATE TABLE IF NOT EXISTS problem_frequency (
    id SERIAL PRIMARY KEY,
    problem_name VARCHAR(100) NOT NULL,
    frequency_value INTEGER DEFAULT 0,
    bar_color VARCHAR(20) DEFAULT '#2563eb'
);

-- 9. Login Users
CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(80) DEFAULT 'User',
    is_active BOOLEAN DEFAULT TRUE,
    assets_count INTEGER DEFAULT 0,
    asset_ids JSONB DEFAULT '[]'::jsonb,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


