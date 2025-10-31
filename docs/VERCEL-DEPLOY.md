# VERCEL DEPLOYMENT GUIDE

## 🚀 Deploy Azora OS to Vercel (10 minutes)

### Prerequisites
- ✅ GitHub account
- ✅ Vercel account (free tier works!)
- ✅ Code pushed to GitHub

---

## STEP 1: Push to GitHub (5 minutes)

**Option A: Using Git Bash**
```bash
cd /c/Users/sizwe/OneDrive/Desktop/azora-os
./deploy-github.sh
```

**Option B: Manual steps**
```bash
# 1. Create GitHub repo at github.com/new
# 2. Copy the remote URL
# 3. Add remote
git remote add origin https://github.com/YOUR_USERNAME/azora-os.git

# 4. Push code
git add .
git commit -m "🚀 Production deployment"
git push -u origin main
```

---

## STEP 2: Deploy to Vercel (5 minutes)

### A. Connect GitHub
1. Go to **vercel.com**
2. Click **"Sign Up"** (use GitHub login)
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Select **"azora-os"**

### B. Configure Project
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install --legacy-peer-deps
```

### C. Add Environment Variables

**Required Variables:**
```bash
# Supabase
SUPABASE_URL=https://mpqlpqegrzxklljwrzpe.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Bank Account
FOUNDER_BANK=Capitec
FOUNDER_ACCOUNT_NUMBER=2278022268
FOUNDER_BRANCH_CODE=470010
FOUNDER_ACCOUNT_TYPE=savings
FOUNDER_ACCOUNT_HOLDER=Sizwe Ngwenya

# Luno (add after signup)
LUNO_API_KEY_ID=your_luno_key_id
LUNO_API_SECRET=your_luno_secret
LUNO_DEFAULT_PAIR=XBTZAR

# Optional
EMAIL_DOMAIN=azora.world
NODE_ENV=production
```

**How to add:**
1. In Vercel project settings
2. Click **"Environment Variables"**
3. Add each variable
4. Click **"Save"**

### D. Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site is LIVE! 🎉

---

## STEP 3: Get Your Live URL

Vercel gives you:
```
https://azora-os.vercel.app
```

**Optional:** Add custom domain
1. Buy domain (azora.world)
2. Vercel → Settings → Domains
3. Add domain
4. Update DNS records
5. SSL auto-configured!

---

## STEP 4: Test Live System

### A. Test API
```bash
curl https://azora-os.vercel.app/api/mint/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "azora-mint",
  "timestamp": "2025-10-30T..."
}
```

### B. Test Withdrawal Flow
1. Create test student account
2. Award 10 AZR tokens
3. Convert to ZAR
4. Withdraw to bank
5. Check Capitec app!

---

## STEP 5: Monitor & Scale

### Vercel Dashboard
- **Deployments:** See all deploys
- **Analytics:** User traffic
- **Logs:** Debug issues
- **Speed Insights:** Performance

### Auto-Deploy
Every push to `main` branch = auto-deploy! 🚀

---

## 🎯 POST-DEPLOYMENT CHECKLIST

- [ ] Site is live at vercel.app
- [ ] Health check passes
- [ ] Supabase connected
- [ ] Bank details configured
- [ ] Luno API working
- [ ] Test withdrawal successful
- [ ] Custom domain added (optional)
- [ ] Analytics tracking (optional)

---

## 🔥 YOU'RE LIVE!

**Next Actions:**
1. ✅ Share URL with first 10 students
2. ✅ Test complete learning → earning flow
3. ✅ Execute first real withdrawal
4. ✅ Scale to 100 students
5. ✅ MAKE R1000 THIS WEEK!

---

**MADE IN AFRICA FOR THE WORLD** 🌍✨
