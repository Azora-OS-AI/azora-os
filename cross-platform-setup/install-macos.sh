#!/bin/bash

# AZORA OS - MACOS DEVELOPMENT ENVIRONMENT SETUP
# Automated installation script for macOS developers
# Date: October 30, 2025

echo "================================================"
echo "  AZORA OS - MACOS DEVELOPMENT ENVIRONMENT SETUP"
echo "================================================"
echo

# Check if running with sudo
if [ "$EUID" -eq 0 ]; then
  echo "[INFO] Running with root privileges"
else
  echo "[WARNING] Not running as root. Some features may not work properly."
  echo
fi

# Check macOS version
echo "[INFO] Checking macOS version..."
sw_vers

# Install Homebrew if not installed
echo "[CHECK] Checking for Homebrew installation..."
if command -v brew &> /dev/null; then
  echo "[SUCCESS] Homebrew is already installed"
else
  echo "[INSTALL] Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Node.js
echo "[CHECK] Checking for Node.js installation..."
if command -v node &> /dev/null; then
  echo "[SUCCESS] Node.js is already installed"
  node --version
else
  echo "[INSTALL] Installing Node.js..."
  brew install node
fi

# Install Git
echo "[CHECK] Checking for Git installation..."
if command -v git &> /dev/null; then
  echo "[SUCCESS] Git is already installed"
  git --version
else
  echo "[INSTALL] Installing Git..."
  brew install git
fi

# Install project dependencies
echo "[INSTALL] Installing project dependencies..."
npm install -g pnpm
pnpm install

# Setup environment variables
echo "[CONFIG] Setting up environment variables..."
echo 'export AZORA_DEV_ENV="macos"' >> ~/.zshrc
echo 'export NODE_ENV="development"' >> ~/.zshrc

# Create desktop alias
echo "[CONFIG] Creating desktop alias..."
cat > ~/Desktop/azora-dev.command << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"/..
npm run dev
EOF
chmod +x ~/Desktop/azora-dev.command

echo
echo "================================================"
echo "  AZORA OS MACOS SETUP COMPLETE!"
echo "================================================"
echo
echo "Next steps:"
echo "1. Open a new terminal"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 in your browser"
echo
echo "For constitutional compliance verification, run:"
echo "'node verify-constitutional-compliance.js'"
echo
echo "Happy coding from Africa! 🇿🇦"