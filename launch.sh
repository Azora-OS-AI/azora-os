#!/bin/bash
# AZORA OS - Universal Launch Script
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   🚀 AZORA OS - AI-Powered Development Platform"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Founded by:"
echo "  • Sizwe Ngwenya - CEO & Founder"
echo "  • Sizwe Motingwe - Head of Sales"
echo "  • Nolundi Ngwenya - Head of Retail"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 22+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version too old. Please upgrade to 22+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "Select launch mode:"
echo "  1) Web Platform (localhost:3000)"
echo "  2) Azora IDE (Desktop Application)"
echo "  3) All Services"
echo "  4) Development Mode"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "🌐 Launching Web Platform..."
        npm run dev
        ;;
    2)
        echo ""
        echo "💻 Launching Azora IDE..."
        npm run ide:start
        ;;
    3)
        echo ""
        echo "⚙️  Starting All Services..."
        npm run services:start
        ;;
    4)
        echo ""
        echo "🔧 Starting Development Mode..."
        npm run dev
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
