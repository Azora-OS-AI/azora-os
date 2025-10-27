-- AZORA Mint-Mine Integration Database Schema
-- PostgreSQL database setup for advanced mining and token minting

-- Create database (run this manually if needed)
-- CREATE DATABASE azora_os;
-- \c azora_os;

-- Mining sessions table
CREATE TABLE IF NOT EXISTS mining_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    algorithm VARCHAR(100) NOT NULL,
    total_hashrate_mhs DECIMAL(10,2),
    total_earnings_usd DECIMAL(20,8) DEFAULT 0,
    azr_minted DECIMAL(30,8) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Minting transactions table
CREATE TABLE IF NOT EXISTS minting_transactions (
    id SERIAL PRIMARY KEY,
    tx_hash VARCHAR(255) UNIQUE NOT NULL,
    amount_azr DECIMAL(30,8) NOT NULL,
    amount_usd DECIMAL(20,8) NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    gas_used BIGINT,
    gas_price_wei DECIMAL(30,0),
    blockchain_status VARCHAR(50) DEFAULT 'pending',
    mining_session_id INTEGER REFERENCES mining_sessions(id),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- Mining statistics table (real-time data)
CREATE TABLE IF NOT EXISTS mining_statistics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    algorithm VARCHAR(100),
    hashrate_mhs DECIMAL(10,2),
    pool VARCHAR(255),
    earnings_usd DECIMAL(20,8) DEFAULT 0,
    power_consumption_watts INTEGER,
    temperature_celsius DECIMAL(5,2),
    shares_accepted INTEGER DEFAULT 0,
    shares_rejected INTEGER DEFAULT 0,
    efficiency DECIMAL(10,4) -- MH/s per watt
);

-- Crypto prices table (for oracle data)
CREATE TABLE IF NOT EXISTS crypto_prices (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    price_usd DECIMAL(20,8) NOT NULL,
    market_cap_usd DECIMAL(30,2),
    volume_24h_usd DECIMAL(30,2),
    price_change_24h DECIMAL(10,4),
    source VARCHAR(50) DEFAULT 'coingecko',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System health monitoring table
CREATE TABLE IF NOT EXISTS system_health (
    id SERIAL PRIMARY KEY,
    component VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    metrics JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alert history table
CREATE TABLE IF NOT EXISTS alert_history (
    id SERIAL PRIMARY KEY,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    message TEXT NOT NULL,
    details JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User wallet tracking table
CREATE TABLE IF NOT EXISTS user_wallets (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    total_azr_minted DECIMAL(30,8) DEFAULT 0,
    total_usd_earned DECIMAL(20,8) DEFAULT 0,
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mining pool configurations table
CREATE TABLE IF NOT EXISTS mining_pools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    port INTEGER,
    username VARCHAR(255),
    password VARCHAR(255),
    priority INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mining_sessions_status ON mining_sessions(status);
CREATE INDEX IF NOT EXISTS idx_mining_sessions_created_at ON mining_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_minting_transactions_tx_hash ON minting_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_minting_transactions_status ON minting_transactions(blockchain_status);
CREATE INDEX IF NOT EXISTS idx_minting_transactions_created_at ON minting_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_mining_statistics_timestamp ON mining_statistics(timestamp);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol_timestamp ON crypto_prices(symbol, timestamp);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health(timestamp);
CREATE INDEX IF NOT EXISTS idx_alert_history_created_at ON alert_history(created_at);
CREATE INDEX IF NOT EXISTS idx_user_wallets_address ON user_wallets(address);

-- Create views for analytics
CREATE OR REPLACE VIEW daily_mining_summary AS
SELECT
    DATE(created_at) as date,
    algorithm,
    COUNT(*) as sessions_count,
    SUM(total_earnings_usd) as total_earnings_usd,
    SUM(azr_minted) as total_azr_minted,
    AVG(total_hashrate_mhs) as avg_hashrate_mhs
FROM mining_sessions
WHERE status = 'completed'
GROUP BY DATE(created_at), algorithm
ORDER BY date DESC;

CREATE OR REPLACE VIEW mining_performance AS
SELECT
    algorithm,
    COUNT(*) as total_sessions,
    SUM(total_earnings_usd) as total_earnings,
    AVG(total_earnings_usd) as avg_earnings_per_session,
    AVG(total_hashrate_mhs) as avg_hashrate,
    SUM(azr_minted) as total_azr_minted
FROM mining_sessions
WHERE status = 'completed'
GROUP BY algorithm
ORDER BY total_earnings DESC;

CREATE OR REPLACE VIEW blockchain_transaction_summary AS
SELECT
    blockchain_status,
    COUNT(*) as transaction_count,
    SUM(amount_azr) as total_azr_amount,
    SUM(amount_usd) as total_usd_value,
    AVG(gas_used) as avg_gas_used,
    COUNT(CASE WHEN confirmed_at IS NOT NULL THEN 1 END) as confirmed_count
FROM minting_transactions
GROUP BY blockchain_status;

-- Insert default mining pool configurations
INSERT INTO mining_pools (name, algorithm, url, port, priority) VALUES
('WoolyPooly IRON', 'FishHash', 'iron.woolypooly.com', 3104, 1),
('FlexPool IRON', 'FishHash', 'iron.flexpool.io', 3333, 2),
('HERO IRON', 'FishHash', 'iron.herominers.com', 1143, 3)
ON CONFLICT (name) DO NOTHING;

-- Insert sample system health record
INSERT INTO system_health (component, status, message, metrics) VALUES
('database', 'healthy', 'Database connection established', '{"connection_pool": 10, "active_connections": 1}'::jsonb),
('blockchain', 'initializing', 'Blockchain connection pending', '{"rpc_url": "http://localhost:8545"}'::jsonb),
('mining_engine', 'starting', 'Mining engine initializing', '{"threads": 4}'::jsonb);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_mining_sessions_updated_at
    BEFORE UPDATE ON mining_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO azora;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO azora;