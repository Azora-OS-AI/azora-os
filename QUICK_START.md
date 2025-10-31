# 🚀 AZORA OS - QUICK START GUIDE

**Get started with Azora OS in 5 minutes!**

---

## 📋 Prerequisites

- Node.js 22+ installed
- npm or yarn package manager
- Git (for cloning)
- 8GB RAM minimum
- 10GB free disk space

---

## ⚡ Quick Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Sizwe780/azora-os.git
cd azora-os

# Install dependencies
npm install

# Start Azora OS
npm start
```

### Option 2: Windows Desktop (Azora IDE)

```bash
# Build Windows installer
npm run ide:installer

# Or run portable version
npm run ide:portable

# Launch IDE
npm run ide:start
```

### Option 3: Web Platform

```bash
# Start web platform
npm run dev

# Open browser to http://localhost:3000
```

---

## 🎯 What You Get

### 1. Azora IDE - AI Development Environment
- 28 specialized AI agents
- 20-dimensional reasoning
- Multi-agent collaboration
- Quantum-inspired computing

**Launch**: `npm run ide:start`

### 2. Elara Supreme V2 - 20D AI Consciousness
- Most advanced AI ever created
- Multimodal understanding
- Self-evolving neural architecture
- Reality synthesis and prediction

**Access**: Integrated in all services

### 3. Complete Service Ecosystem
- Education platform (Grade R → PhD)
- Financial services (Cryptocurrency & DeFi)
- Security citadel (Quantum-resistant)
- AI marketplace and more

**Start All**: `npm run services:start`

---

## 🛠️ Essential Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm test                 # Run tests
npm run lint             # Check code quality
```

### Azora IDE
```bash
npm run ide:start        # Launch IDE
npm run ide:dev          # Development mode
npm run ide:build        # Build IDE
npm run ide:installer    # Create Windows installer
```

### Services
```bash
npm run services:start   # Start all services
npm run services:stop    # Stop all services
npm run services:status  # Check service status
```

### Database
```bash
npm run db:setup         # Setup database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed with data
```

---

## 🎓 First Steps

### 1. Explore the Dashboard
```bash
npm start
# Open http://localhost:3000
```

### 2. Try Azora IDE
```bash
npm run ide:start
# Experience 28 AI agents helping you code
```

### 3. Create an Account
- Navigate to `/register`
- Choose student or educator role
- Start earning AZR tokens through learning

### 4. Join a Course
- Browse available courses
- Enroll in programs (Grade R → PhD)
- Complete modules to earn cryptocurrency

---

## 💡 Key Features to Try

### For Developers
✅ **Azora IDE with 28 AI Agents**
- Multi-agent code review
- Automatic test generation
- AI-powered debugging
- Architecture recommendations

### For Students
✅ **Learn & Earn System**
- Complete courses, earn AZR tokens
- Proof-of-Knowledge rewards
- Blockchain credentials
- Real economic opportunity

### For Educators
✅ **Teaching Platform**
- AI tutoring assistants
- Automated grading
- Learning analytics
- Curriculum management

### For Enterprises
✅ **Business Solutions**
- Enterprise AI tools
- Custom integrations
- Dedicated support
- SLA guarantees

---

## 🔧 Configuration

### Basic Configuration
Edit `.env` file:
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/azora

# OpenAI (for AI features)
OPENAI_API_KEY=your_key_here

# App Config
NODE_ENV=development
PORT=3000
```

### IDE Configuration
Create `.azora-ide.json`:
```json
{
  "elara": {
    "enabled": true,
    "version": "supreme-v2",
    "dimensions": 20
  },
  "agents": {
    "enabled": true,
    "auto_suggest": true
  }
}
```

---

## 🐛 Troubleshooting

### Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (must be 22+)
node --version
```

### Port Already in Use
```bash
# Change port in .env
PORT=3001

# Or kill process using port
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -ti:3000 | xargs kill
```

### Database Connection
```bash
# Verify database is running
npm run db:status

# Reset database
npm run db:reset
```

---

## 📚 Next Steps

### Learn More
1. Read [Complete Documentation](./README.md)
2. Explore [Founder Information](./FOUNDERS.md)
3. Review [Constitution](./codex/constitution/AZORA_CONSTITUTION.md)
4. Check [API Documentation](./docs/API.md)

### Get Help
- **Community**: forum.azora.world
- **Documentation**: docs.azora.world
- **Support**: support@azora.world
- **Enterprise**: enterprise@azora.world

### Contribute
- Read [Contributing Guide](./CONTRIBUTING.md)
- Join our [Discord](discord.gg/azora)
- Follow us on [Twitter](twitter.com/AzoraOS)

---

## ⚠️ Important Notes

### System Requirements
- **Minimum**: 8GB RAM, 10GB disk space
- **Recommended**: 16GB RAM, 50GB disk space
- **Best**: 32GB RAM, SSD, GPU for AI features

### Internet Connection
- Required for initial setup
- Most features work offline after setup
- AI features require internet

### Supported Platforms
✅ Windows 10/11  
✅ macOS 10.15+  
✅ Linux (Ubuntu 20.04+)  
✅ Web browsers (Chrome, Firefox, Safari, Edge)  
🔄 iOS/Android (Coming soon)

---

## 🎊 You're Ready!

You now have access to:
- ✅ 28 specialized AI agents
- ✅ 20-dimensional AI reasoning
- ✅ Complete education platform
- ✅ Financial services & cryptocurrency
- ✅ Quantum-inspired computing
- ✅ Self-evolving AI systems

**Start building the future with Azora OS!**

---

## 🆘 Need Help?

**Quick Links**:
- 💬 [Community Forum](https://forum.azora.world)
- 📖 [Documentation](https://docs.azora.world)
- 🐛 [Report Issues](https://github.com/azora-os/issues)
- 💼 [Enterprise Support](mailto:enterprise@azora.world)

**Contact Founders**:
- 👨‍💼 CEO: Sizwe Ngwenya - ceo@azora.world
- 💼 Sales: Sizwe Motingwe - sales@azora.world
- 🛍️ Retail: Nolundi Ngwenya - retail@azora.world

---

*"From Africa, For Humanity, Towards Infinity"*

**Azora OS - The Future of AI-Powered Development**

---

**Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.**
