# Azora OS - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
```bash
node -v  # v18 or higher
npm -v   # v9 or higher
```

### 1. Clone & Install
```bash
git clone <repository-url>
cd azora-os
npm install
```

### 2. Run Development Servers

#### Main Application
```bash
npm run dev
# Visit: http://localhost:3000
```

#### Elara IDE (NEW!)
```bash
cd elara-ide
npm install
npm run dev
# Visit: http://localhost:3002
```

#### Marketplace UI
```bash
cd marketplace-ui
npm install
npm run dev
# Visit: http://localhost:5173
```

#### Pay UI
```bash
cd pay-ui
npm install
npm run dev
# Visit: http://localhost:5173
```

### 3. Build for Production
```bash
# Main app
npm run build

# Elara IDE
cd elara-ide && npm run build

# Marketplace/Pay UI
cd marketplace-ui && npm run build
cd pay-ui && npm run build
```

### 4. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy all apps
./deploy-all-apps.sh

# Or deploy individually
vercel --prod
```

## 📚 Key Documentation

- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **UPGRADE_COMPLETE_SUMMARY.md** - What was upgraded
- **FINAL_STATUS_REPORT.md** - Full status report
- **README.md** - Main documentation

## 🎯 Key Features

### Elara IDE
- AI-powered code editor
- Integrated terminal
- File explorer
- Elara AI assistant
- Theme switching

### Main Platform
- Modern landing page
- Feature showcase
- Statistics dashboard
- Responsive design

### Marketplace & Pay
- Service catalog
- Payment processing
- User management
- Analytics dashboard

## 🔧 Common Commands

```bash
# Development
npm run dev                    # Start main app
npm run elara:ide:start       # Start Elara IDE

# Building
npm run build                  # Build main app
npm run build:all             # Build everything

# Testing
npm test                       # Run tests
npm run lint                   # Check code quality

# Deployment
npm run deploy:all            # Deploy everything
npm run deploy:vercel         # Deploy to Vercel
```

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Vercel Deployment Issues
```bash
# Pull latest environment variables
vercel env pull

# Check deployment logs
vercel logs <deployment-url>
```

## 🎉 You're Ready!

All systems are upgraded and ready for deployment. See the comprehensive documentation for detailed information.

**Happy coding! 🚀**
