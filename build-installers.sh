#!/bin/bash
# AZORA PROPRIETARY LICENSE
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

echo "========================================"
echo "AZORA OS - UNIVERSAL INSTALLER BUILDER"
echo "========================================"
echo ""

# Detect platform
PLATFORM=$(uname -s)
case "$PLATFORM" in
    Linux*)     PLATFORM_NAME="Linux";;
    Darwin*)    PLATFORM_NAME="macOS";;
    *)          PLATFORM_NAME="Unknown";;
esac

echo "Platform detected: $PLATFORM_NAME"
echo ""

echo "[1/5] Checking system health..."
npm run health:full
if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: Health check found issues. Continue anyway? (y/n)"
    read -r continue
    if [ "$continue" != "y" ] && [ "$continue" != "Y" ]; then
        exit 1
    fi
fi

echo ""
echo "[2/5] Installing dependencies..."
npm install

echo ""
echo "[3/5] Building Next.js application..."
npm run build

echo ""
echo "[4/5] Creating $PLATFORM_NAME installers..."
node build-production-installers.js

echo ""
echo "[5/5] Done!"
echo ""
echo "========================================"
echo "Installers created in: dist-installers/"
echo "========================================"
echo ""
echo "Available installers:"
ls -1 dist-installers/ 2>/dev/null || echo "No installers found yet"
echo ""
echo "Next steps:"
echo "1. Test the installers"
if [ "$PLATFORM_NAME" = "macOS" ]; then
    echo "2. Sign and notarize the app (required for distribution)"
fi
echo "3. Distribute to users"
echo ""
