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
    subject VARCHAR(255),
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
    status VARCHAR(50) -- ASSIGNED, AVAILABLE, MAINTENANCE
);

-- 4. Real-time Activity Feed (List View)
CREATE TABLE IF NOT EXISTS activity_feed (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50), -- login, update, logout
    title VARCHAR(255),
    description TEXT,
    time_label VARCHAR(50)
);

-- 5. Critical Maintenance (Action Table View)
CREATE TABLE IF NOT EXISTS maintenance (
    asset_id VARCHAR(50) PRIMARY KEY,
    issue VARCHAR(255),
    priority VARCHAR(50), -- CRITICAL, HIGH, MEDIUM
    action_text VARCHAR(100)
);

-- SEED DATA (Matching your screenshots exactly)
INSERT INTO expiring_assets (type, name, expiry_label) VALUES 
('laptop', 'MacBook Pro M2', 'EXPIRING IN 12 DAYS'),
('router', 'Cisco Edge Switch', 'EXPIRING IN 24 DAYS'),
('printer', 'Printer Laser Jett', 'DUE IN 2 DAYS');

INSERT INTO repair_tickets (ticket_id, subject, status, updated_at) VALUES 
('12345', 'Display flicker - User A.smith', 'IN PROGRESS', '2026-01-01'),
('12346', 'Keyboard Replacement', 'RESOLVED', '2026-01-02'),
('12347', 'Cloud Sync Error', 'PENDING', '2026-01-03'),
('12348', 'Software Update Failure', 'URGENT', '2026-01-04');

INSERT INTO inventory (asset_id, category, serial_number, service_years, purchase_date, warranty_expiry, status) VALUES 
('#AST-2024-001', 'Laptop', 'SN-82910-XQ-202', 2.4, '2021-10-12', '2024-10-12', 'ASSIGNED'),
('#AST-2024-042', 'Monitor', 'MON-77-P-001', 0.8, '2023-05-20', '2026-05-20', 'AVAILABLE'),
('#AST-2023-119', 'Tablet', 'TAB-9002-K', 3.1, '2021-01-15', '2024-01-15', 'MAINTENANCE');

INSERT INTO activity_feed (type, title, description, time_label) VALUES 
('login', 'Administrator Login by J. Abernathy', 'Internal Console [Terminal 04]', 'JUST NOW'),
('update', 'Credential Update for User ID: 9928', 'Password successfully changed via Security Portal.', '12M AGO');

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

-- SEED DATA
INSERT INTO ongoing_repairs (name, description, severity, elapsed, action_label) VALUES 
('WorkStation #442 - Research Dept', 'GPU Driver Kernal Panic after latest firmware update.', 'URGENT', '2H 15M ELAPSED', 'View Log'),
('Mainframe Server Cluster A-12', 'Thermal throttling detected in Rack 4. Cooling failure suspected.', 'CRITICAL', '2H 15M ELAPSED', 'Assign Support');

INSERT INTO service_history (asset_id, asset_name, failure_frequency, last_service, condition, status_icon) VALUES 
('LPT-7721', 'MacBook Pro 16" - Design Lab', '2 incidents in 6 months', '2023-10-12', 'Degrading', 'warning'),
('SRV-0019', 'Dell PowerEdge - Data Ctr 2', 'Critical Failure Rate', '2023-12-01', 'Unstable', 'error'),
('PRN-8821', 'HP Enterprise Jet - Floor 3', '1 incident in 12 months', '2024-01-15', 'Excellent', 'success');

INSERT INTO audit_logs (timestamp, user_identity, description, ip_address, status) VALUES 
('2023-10-24 09:42:15', 'Alexandria Johnson', 'Modified asset status for MBP-2023-004 from ''Active'' to ''In Repair''.', '192.168.1.142', 'Success'),
('2023-10-24 08:15:02', 'System Daemon', 'Automatic backup of warranty database completed successfully.', 'Internal', 'Success'),
('2023-10-23 11:59:44', 'Unauthorized User', 'Multiple failed login attempts detected for account ''sys_admin_prime''.', '45.22.190.11', 'Blocked');

-- Problem Frequency Stats
CREATE TABLE IF NOT EXISTS problem_frequency (
    id SERIAL PRIMARY KEY,
    problem_name VARCHAR(100) NOT NULL,
    frequency_value INTEGER DEFAULT 0,
    bar_color VARCHAR(20) DEFAULT '#2563eb'
);

INSERT INTO problem_frequency (problem_name, frequency_value, bar_color) VALUES
('Power Supply Failure', 6200, '#2563eb'),
('Software Conflict', 4100, '#2563eb'),
('SSD Degradation', 8300, '#2563eb');
