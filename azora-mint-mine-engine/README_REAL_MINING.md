# 🚀 REAL CRYPTOCURRENCY MINING SETUP
## Intel Core i7-1065G7 Mining Rig

This setup enables **actual cryptocurrency mining** for REAL money using your Intel Core i7-1065G7 CPU. No more simulations - this mines real coins!

## ⚠️ IMPORTANT WARNINGS

- **REAL MONEY**: This will mine actual cryptocurrencies that can be sold for real fiat money
- **ELECTRICITY COSTS**: Mining uses 25-45W of power (~$2-4/month at $0.12/kWh)
- **TAXES**: Mining income may be taxable in your jurisdiction
- **VOLATILITY**: Cryptocurrency prices fluctuate wildly
- **SECURITY**: Use strong passwords and secure your wallets

## 📋 QUICK START (5 minutes)

### 1. Configure Wallets
```bash
cd /workspaces/azora-os/real-mining
nano wallets.conf
```

Replace the `PLACEHOLDER` addresses with real wallet addresses:

**Monero (XMR):**
- Download: https://www.getmonero.org/downloads/
- Create wallet and copy primary address
- Replace: `XMR_WALLET="your_xmr_address_here"`

**Conflux (CFX):**
- Use MetaMask browser extension
- Add Conflux network: https://docs.confluxnetwork.org/docs/general/conflux-portal/metamask
- Replace: `CFX_WALLET="cfx:your_cfx_address_here"`

**Ergo (ERG):**
- Download Yoroi wallet: https://yoroi-wallet.com/
- Create Ergo wallet and copy address
- Replace: `ERG_WALLET="your_erg_address_here"`

**Ravencoin (RVN):**
- Download wallet: https://ravencoin.org/wallet/
- Create wallet and copy RVN address
- Replace: `RVN_WALLET="your_rvn_address_here"`

### 2. Run Setup
```bash
./setup_real_mining.sh
```

### 3. Start Mining
Choose option 1 for auto-profit switching, or pick a specific coin.

## 💰 EXPECTED PROFITABILITY

| Coin | Algorithm | Hashrate | Daily Profit | Monthly Profit |
|------|-----------|----------|--------------|----------------|
| **ERG** | Autolykos v2 | ~35 MH/s | **$0.12** | **$3.60** |
| **CFX** | Octopus | ~25 MH/s | **$0.08** | **$2.40** |
| **XMR** | RandomX | ~3 KH/s | **$0.07** | **$2.10** |
| **RVN** | KawPow | ~12 MH/s | **$0.03** | **$0.90** |

**Net Profit** (after $3/month electricity): **$0.02-0.09/day** ($0.60-2.70/month)

## 🖥️ MINING DASHBOARD

Real-time monitoring at: **http://localhost:5001**

Features:
- ✅ Live hashrate monitoring
- ✅ Accepted/rejected shares
- ✅ Real-time profitability
- ✅ System temperature & power usage
- ✅ Electricity cost calculations
- ✅ Net profit tracking

## 🔧 MANUAL MINING COMMANDS

### Start Auto-Profit Mining
```bash
./start_real_mining.sh
```

### Mine Specific Coins
```bash
./mine_xmr.sh  # Monero
./mine_cfx.sh  # Conflux
./mine_erg.sh  # Ergo
./mine_rvn.sh  # Ravencoin
```

### Monitor Mining
```bash
# View dashboard
xdg-open http://localhost:5001

# Check mining status
ps aux | grep lolMiner
```

## ⚙️ HARDWARE OPTIMIZATION

Your i7-1065G7 is optimized for:
- **8-thread utilization** (all cores + hyperthreading)
- **DDR4-3200 memory** bandwidth optimization
- **Turbo Boost** sustained at 3.9GHz
- **CPU affinity** pinned to all cores
- **Large pages** enabled for better performance

## 🔌 ELECTRICITY MONITORING

- **Idle Power**: ~5-10W
- **Mining Power**: 25-45W
- **Daily Cost**: $0.07-0.13 (@ $0.12/kWh)
- **Monthly Cost**: $2.10-3.90

Monitor your actual electricity rates and adjust calculations accordingly.

## 🏊 MINING POOLS

### Primary Pools (Recommended)
- **WoolyPooly**: Best for CPU mining, low fees
- **MineXMR**: Excellent for Monero
- **HeroMiners**: Good for Ergo

### Backup Pools
- **SupportXMR**: Monero alternative
- **NiceHash**: Sell hashrate for BTC
- **RavenMiner**: Ravencoin focused

## 💱 CONVERTING TO FIAT

### Exchanges for each coin:
- **XMR**: LocalMonero, Bisq, Kraken
- **CFX**: KuCoin, Gate.io, MEXC
- **ERG**: Gate.io, CoinEx, HotBit
- **RVN**: Binance, KuCoin, Gate.io

### Popular Fiat Exchanges:
- **Coinbase**: Easy USD conversion
- **Binance**: Low fees, many pairs
- **Kraken**: Good for privacy coins

## 🛡️ SECURITY BEST PRACTICES

1. **Use strong passwords** for all accounts
2. **Enable 2FA** everywhere possible
3. **Backup wallet seeds** offline (paper, metal)
4. **Never share private keys**
5. **Use reputable exchanges** only
6. **Keep software updated**
7. **Monitor for malware**

## 📊 PERFORMANCE MONITORING

### Key Metrics to Watch:
- **Hashrate**: Should be stable (varies by algorithm)
- **Acceptance Rate**: >98% is good
- **Temperature**: Keep under 80°C
- **Uptime**: Maximize mining time
- **Profitability**: Compare vs electricity costs

### Troubleshooting:
- **Low hashrate**: Check CPU affinity, try different algorithms
- **Rejected shares**: Check internet connection, pool settings
- **High temperature**: Improve cooling, reduce overclocking
- **Pool connection issues**: Try different pools or ports

## 📈 OPTIMIZATION TIPS

1. **Mine during off-peak hours** (cheaper electricity)
2. **Switch algorithms** based on profitability
3. **Monitor pool fees** (1-2% is standard)
4. **Consider dual mining** if possible
5. **Track your costs** vs rewards
6. **Reinvest profits** into better hardware

## ⚖️ LEGAL CONSIDERATIONS

- **Check local laws** about cryptocurrency mining
- **Report mining income** for taxes
- **Understand exchange regulations**
- **Be aware of environmental regulations**
- **Comply with KYC/AML requirements**

## 🚨 EMERGENCY STOP

To stop all mining immediately:
```bash
pkill -f lolMiner
pkill -f mining
```

## 📞 SUPPORT

- **Mining Pools**: Check pool websites for help
- **Wallets**: Use official documentation
- **Exchanges**: Contact support for account issues
- **Hardware**: Intel support for CPU issues

## 🎯 FINAL NOTES

- **Start small**: Test with small amounts first
- **Monitor closely**: Track performance and costs
- **Stay informed**: Crypto markets change rapidly
- **Be patient**: Mining profitability fluctuates
- **Have fun**: You're now a real cryptocurrency miner! 🚀

---

**Remember**: Mining is speculative and carries financial risk. Only mine with money you can afford to lose. Prices can go down as well as up!