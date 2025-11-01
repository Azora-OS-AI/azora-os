#!/bin/bash

# ===========================================================================
# AZORA OS - PROFESSIONAL INSTALLER (MACOS)
# Universal Human Infrastructure Platform
# ===========================================================================
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
# ===========================================================================

# --- Configuration ---
INSTALL_DIR="/Applications/Azora OS.app"

# --- Colors and Styles ---
C_CYAN='\033[0;36m'
C_GREEN='\033[0;32m'
C_RED='\033[0;31m'
C_YELLOW='\033[1;33m'
C_RESET='\033[0m'

# --- UI Functions ---
show_header() {
    clear
    echo -e "${C_CYAN}"
    echo "╔═══════════════════════════════════════════════════════════════════════╗"
    echo "║                          AZORA OS INSTALLER                           ║"
    echo "╚═══════════════════════════════════════════════════════════════════════╝"
    echo -e "${C_RESET}"
}

write_status() {
    case "$2" in
        Success) echo -e " ${C_GREEN}✓ $1${C_RESET}" ;;
        Error)   echo -e " ${C_RED}✗ $1${C_RESET}" ;;
        Warning) echo -e " ${C_YELLOW}⚠ $1${C_RESET}" ;;
        *)       echo -e " ${C_CYAN}→ $1${C_RESET}" ;;
    esac
}

# --- System Checks ---
check_prerequisites() {
    write_status "Checking system prerequisites..."
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        write_status "Node.js not found. Please install from nodejs.org" "Error"
        return 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//' | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        write_status "Node.js version too old. Please upgrade to v18+" "Warning"
        return 1
    fi
    write_status "Node.js v$(node -v) detected" "Success"
    return 0
}

# --- Core Functions ---
install_azora_os() {
    show_header
    write_status "Starting Azora OS Installation..."
    
    if ! check_prerequisites; then
        write_status "Prerequisites check failed!" "Error"
        exit 1
    fi

    # Get script directory
    SOURCE_DIR=$(dirname "$0")/..

    # Create installation directory
    write_status "Creating application bundle..."
    mkdir -p "$INSTALL_DIR/Contents/MacOS"
    mkdir -p "$INSTALL_DIR/Contents/Resources"

    # Copy files
    write_status "Copying Azora OS files..."
    ITEMS_TO_COPY=(
        "ui/app" "ui/public" "ui/components" "ui/lib"
        "ui/package.json" "ui/package-lock.json" "ui/next.config.ts"
        "ui/tailwind.config.js" "ui/tsconfig.json" "BRANDING-GUIDE.md"
    )
    for item in "${ITEMS_TO_COPY[@]}"; do
        cp -r "$SOURCE_DIR/$item" "$INSTALL_DIR/Contents/Resources/"
    done

    # Install dependencies and build
    write_status "Installing dependencies & building... (This might take a moment)"
    (cd "$INSTALL_DIR/Contents/Resources" && npm install --production --silent && npm run build)

    # Create launcher script
    write_status "Creating launcher..."
    LAUNCHER_SCRIPT="#!/bin/bash
cd \"$INSTALL_DIR/Contents/Resources\"
npm start &> /dev/null &
open http://localhost:3000
"
    echo "$LAUNCHER_SCRIPT" > "$INSTALL_DIR/Contents/MacOS/Azora OS"
    chmod +x "$INSTALL_DIR/Contents/MacOS/Azora OS"

    # Create Info.plist
    write_status "Creating application metadata..."
    PLIST="<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
<plist version=\"1.0\">
<dict>
    <key>CFBundleExecutable</key>
    <string>Azora OS</string>
    <key>CFBundleIconFile</key>
    <string>favicon.icns</string>
    <key>CFBundleIdentifier</key>
    <string>com.azora.os</string>
    <key>CFBundleName</key>
    <string>Azora OS</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
</dict>
</plist>"
    echo "$PLIST" > "$INSTALL_DIR/Contents/Info.plist"

    # Convert favicon to .icns
    # Requires sips, which is built into macOS.
    sips -s format icns "$INSTALL_DIR/Contents/Resources/public/favicon.ico" --out "$INSTALL_DIR/Contents/Resources/favicon.icns" &> /dev/null

    # --- Completion Message ---
    write_status "Installation complete!" "Success"
    echo "Azora OS has been installed to your Applications folder."
    open "$INSTALL_DIR"
}

# --- Main Logic ---
install_azora_os
