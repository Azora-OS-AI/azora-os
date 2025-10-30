#!/bin/bash

# AZORA OS - LINUX DEVELOPMENT ENVIRONMENT SETUP
# Automated installation script for Linux developers
# Date: October 30, 2025

echo "================================================"
echo "  AZORA OS - LINUX DEVELOPMENT ENVIRONMENT SETUP"
echo "================================================"
echo

# Check if running with sudo
if [ "$EUID" -eq 0 ]; then
  echo "[INFO] Running with root privileges"
else
  echo "[WARNING] Not running as root. Some features may not work properly."
  echo
fi

# Detect Linux distribution
if [ -f /etc/os-release ]; then
  . /etc/os-release
  DISTRO=$NAME
  VERSION=$VERSION_ID
  echo "[INFO] Detected distribution: $DISTRO $VERSION"
else
  echo "[WARNING] Could not detect Linux distribution"
fi

# Update package manager
echo "[UPDATE] Updating package manager..."
if command -v apt &> /dev/null; then
  sudo apt update
elif command -v yum &> /dev/null; then
  sudo yum update -y
elif command -v dnf &> /dev/null; then
  sudo dnf update -y
elif command -v pacman &> /dev/null; then
  sudo pacman -Syu --noconfirm
else
  echo "[ERROR] Unsupported package manager"
  exit 1
fi

# Install Node.js
echo "[CHECK] Checking for Node.js installation..."
if command -v node &> /dev/null; then
  echo "[SUCCESS] Node.js is already installed"
  node --version
else
  echo "[INSTALL] Installing Node.js..."
  if command -v apt &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
  elif command -v yum &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo -E bash -
    sudo yum install -y nodejs
  elif command -v dnf &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo -E bash -
    sudo dnf install -y nodejs
  elif command -v pacman &> /dev/null; then
    sudo pacman -S --noconfirm nodejs npm
  fi
fi

# Install Git
echo "[CHECK] Checking for Git installation..."
if command -v git &> /dev/null; then
  echo "[SUCCESS] Git is already installed"
  git --version
else
  echo "[INSTALL] Installing Git..."
  if command -v apt &> /dev/null; then
    sudo apt install -y git
  elif command -v yum &> /dev/null; then
    sudo yum install -y git
  elif command -v dnf &> /dev/null; then
    sudo dnf install -y git
  elif command -v pacman &> /dev/null; then
    sudo pacman -S --noconfirm git
  fi
fi

# Install project dependencies
echo "[INSTALL] Installing project dependencies..."
npm install -g pnpm
pnpm install

# Setup environment variables
echo "[CONFIG] Setting up environment variables..."
echo 'export AZORA_DEV_ENV="linux"' >> ~/.bashrc
echo 'export NODE_ENV="development"' >> ~/.bashrc

# Create desktop entry (for GNOME/KDE)
echo "[CONFIG] Creating desktop entry..."
cat > ~/.local/share/applications/azora-os-dev.desktop << EOF
[Desktop Entry]
Name=Azora OS Dev
Comment=Azora OS Development Environment
Exec=/bin/bash -c "cd $(pwd) && npm run dev"
Icon=utilities-terminal
Terminal=true
Type=Application
Categories=Development;
EOF

echo
echo "================================================"
echo "  AZORA OS LINUX SETUP COMPLETE!"
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