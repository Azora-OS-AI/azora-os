#!/bin/bash

# AZORA OS - CROSS-PLATFORM DEVELOPMENT ENVIRONMENT SETUP
# Unified installation script for all platforms
# Date: October 30, 2025

echo "================================================"
echo "  AZORA OS - CROSS-PLATFORM DEVELOPMENT SETUP"
echo "================================================"
echo

# Detect platform
echo "[DETECT] Detecting platform..."

# Check for Windows (WSL or Git Bash)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  PLATFORM="windows"
  echo "[INFO] Detected Windows platform"
  echo "[RUN] Executing Windows installation script..."
  ./install-windows.bat
  exit 0
fi

# Check for macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  PLATFORM="macos"
  echo "[INFO] Detected macOS platform"
  echo "[RUN] Executing macOS installation script..."
  chmod +x ./install-macos.sh
  ./install-macos.sh
  exit 0
fi

# Assume Linux for all other cases
PLATFORM="linux"
echo "[INFO] Detected Linux platform"
echo "[RUN] Executing Linux installation script..."
chmod +x ./install-linux.sh
./install-linux.sh
exit 0