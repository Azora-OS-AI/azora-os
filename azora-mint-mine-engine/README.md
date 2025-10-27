# AZORA Mint-Mine Integration Engine v2.0

Advanced blockchain integration engine for AZR token minting based on mining earnings.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Set Up Database
Ensure PostgreSQL is running and create the database:
```sql
CREATE DATABASE azora_os;
CREATE USER azora WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE azora_os TO azora;
```

### 4. Run the Engine
```bash
python azora_mint_mine_engine_v2.py
```

## 🔧 Configuration

### Required Environment Variables
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL connection
- `AZORA_RPC_URL`: Blockchain RPC endpoint
- `AZORA_CHAIN_ID`: Chain ID (default: 1337 for local)
- `AZR_CONTRACT_ADDRESS`: Deployed AZR contract address
- `MINTER_PRIVATE_KEY`: Private key for minting (keep secure!)
- `MINTER_ADDRESS`: Wallet address for receiving minted tokens

### Optional
- `ALERT_WEBHOOK`: URL for error notifications

## 🏗️ Architecture

The engine runs multiple monitoring threads:
- **Mining Monitor**: Checks pool earnings every 30 seconds
- **Blockchain Monitor**: Monitors chain health every minute
- **Price Oracle**: Updates crypto prices every 5 minutes
- **Auto-Mint Worker**: Performs maintenance tasks

## ⚠️ Critical Fixes Applied

This version fixes several critical issues from v1.0:
- **Earnings Calculation**: Now tracks deltas instead of cumulative totals
- **Environment Security**: Uses .env files instead of hardcoded paths
- **Thread Management**: Proper main loop keeps engine running
- **Error Handling**: Specific exception catching instead of broad except blocks

## 📊 Monitoring

Logs are written to `logs/mint_mine_engine.log`. Monitor the console output for real-time status.

## 🛡️ Security Notes

- Never commit `.env` files to version control
- Use strong passwords for database access
- Keep private keys encrypted and secure
- Run the engine in a controlled environment

## 🐛 Troubleshooting

**Engine exits immediately**: Check that all required environment variables are set.

**Database connection fails**: Verify PostgreSQL is running and credentials are correct.

**Blockchain connection fails**: Ensure RPC URL is accessible and contract is deployed.

**No minting occurs**: Check pool API responses and wallet balance tracking.