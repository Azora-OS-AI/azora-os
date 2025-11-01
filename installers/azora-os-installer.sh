#!/bin/bash

# ===========================================================================
# AZORA OS - PROFESSIONAL INSTALLER (LINUX)
# Universal Human Infrastructure Platform
# ===========================================================================
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
# ===========================================================================

# --- Default Settings ---
INSTALL_DIR="/usr/local/lib/azora-os"

# --- Colors and Styles ---
C_CYAN='\033[0;36m'
C_GREEN='\033[0;32m'
C_RED='\033[0;31m'
C_YELLOW='\033[1;33m'
C_BOLD='\033[1m'
C_RESET='\033[0m'

# --- Helper Functions ---
show_header() {
    clear
    echo -e "${C_CYAN}"
    echo "╔═══════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                       ║"
    echo "║                          █████╗ ███████╗ ██████╗ ██████╗  █████╗     ║"
    echo "║                         ██╔══██╗╚══███╔╝██╔═══██╗██╔══██╗██╔══██╗    ║"
    echo "║                         ███████║  ███╔╝ ██║   ██║██████╔╝███████║    ║"
    echo "║                         ██╔══██║ ███╔╝  ██║   ██║██╔══██╗██╔══██║    ║"
    echo "║                         ██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║    ║"
    echo "║                         ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ║"
    echo "║                                                                       ║"
    echo "║               UNIVERSAL HUMAN INFRASTRUCTURE PLATFORM                 ║"
    echo "║                                                                       ║"
    echo "║                   Quantum-Secure • AI-Powered • Open Source           ║"
    echo "║                                                                       ║"
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

# --- Prerequisite Checks ---
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        write_status "Administrator privileges required!" "Error"
        echo -e "   ${C_YELLOW}Please run this installer with sudo:${C_RESET}"
        echo -e "   ${C_YELLOW}sudo ./azora-os-installer.sh${C_RESET}"
        exit 1
    fi
}

check_prerequisites() {
    write_status "Checking system prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        write_status "Node.js not found. Please install Node.js 18+ from nodejs.org" "Error"
        return 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//' | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        write_status "Node.js version too old ($NODE_VERSION). Need v18+" "Warning"
        return 1
    else
        write_status "Node.js v$(node -v) detected" "Success"
    fi
    return 0
}

# --- Installation Functions ---
install_azora_os() {
    show_header
    write_status "Starting Azora OS Installation..."
    echo ""
    
    check_sudo
    if ! check_prerequisites; then
        echo ""
        write_status "Prerequisites check failed!" "Error"
        exit 1
    fi
    
    echo ""
    write_status "Installation Details:"
    echo -e "   Installation Path: ${C_YELLOW}$INSTALL_DIR${C_RESET}"
    echo ""
    
    # Create installation directory
    write_status "Creating installation directory..."
    mkdir -p "$INSTALL_DIR"
    
    # Copy files
    write_status "Copying Azora OS files..."
    SOURCE_DIR=$(dirname "$(realpath "$0")")/..
    
    ITEMS_TO_COPY=(
        "ui/app" "ui/public" "ui/components" "ui/lib"
        "ui/package.json" "ui/package-lock.json" "ui/next.config.ts"
        "ui/tailwind.config.js" "ui/tsconfig.json" "BRANDING-GUIDE.md"
    )
    
    for item in "${ITEMS_TO_COPY[@]}"; do
        cp -r "$SOURCE_DIR/$item" "$INSTALL_DIR/"
    done
    
    write_status "Files copied successfully" "Success"
    
    # Install dependencies
    write_status "Installing dependencies (this may take a few minutes)..."
    (cd "$INSTALL_DIR" && npm install --production --silent)
    write_status "Dependencies installed successfully" "Success"

    # Build application
    write_status "Building application for production..."
    (cd "$INSTALL_DIR" && npm run build)
    write_status "Build completed successfully" "Success"

    # Create launcher
    write_status "Creating launcher script..."
    LAUNCHER_PATH="/usr/local/bin/azora-os"
    echo "#!/bin/bash
cd \"$INSTALL_DIR\"
npm start &> /dev/null &
" > "$LAUNCHER_PATH"
    chmod +x "$LAUNCHER_PATH"

    # Create desktop entry
    write_status "Creating application menu entry..."
    DESKTOP_ENTRY="[Desktop Entry]
Version=1.0
Name=Azora OS
Comment=Universal Human Infrastructure Platform
Exec=azora-os
Icon=$INSTALL_DIR/ui/public/favicon.ico
Terminal=false
Type=Application
Categories=Development;IDE;"
    echo -e "$DESKTOP_ENTRY" > "/usr/share/applications/azora-os.desktop"

    # Create uninstaller
    write_status "Creating uninstaller..."
    UNINSTALLER_SCRIPT="#!/bin/bash
        echo -e '${C_YELLOW}Uninstalling Azora OS...${C_RESET}'
        rm -rf \"$INSTALL_DIR\"
        rm -f /usr/local/bin/azora-os
        rm -f /usr/share/applications/azora-os.desktop
        echo -e '${C_GREEN}Azora OS uninstalled successfully${C_RESET}'
    "
    echo -e "$UNINSTALLER_SCRIPT" > "$INSTALL_DIR/uninstall.sh"
    chmod +x "$INSTALL_DIR/uninstall.sh"

    # --- Final Message ---
    echo -e "${C_GREEN}"
    echo "╔═══════════════════════════════════════════════════════════════════════╗"
    echo "║                    ✓ INSTALLATION COMPLETE!                          ║"
    echo "╚═══════════════════════════════════════════════════════════════════════╝"
    echo -e "${C_RESET}"
    echo -e "   Launch Azora OS by typing ${C_YELLOW}'azora-os'${C_RESET} in your terminal or find it in your applications menu."
    echo ""
}

# --- Uninstallation ---
uninstall_azora_os() {
    show_header
    write_status "Uninstalling Azora OS..." "Warning"
    echo ""
    check_sudo
    
    read -p "Are you sure you want to uninstall Azora OS? (y/N) " confirm
    if [[ "$confirm" =~ ^[yY](es)?$ ]]; then
        if [ -f "$INSTALL_DIR/uninstall.sh" ]; then
            /bin/bash "$INSTALL_DIR/uninstall.sh"
        else
            write_status "Uninstaller script not found. Performing manual uninstall..."
            rm -rf "$INSTALL_DIR"
            rm -f /usr/local/bin/azora-os
            rm -f /usr/share/applications/azora-os.desktop
            write_status "Azora OS has been uninstalled" "Success"
        fi
    else
        write_status "Uninstallation cancelled" "Info"
    fi
}

# --- Main Logic ---
if [ "$1" == "--uninstall" ]; then
    uninstall_azora_os
else
    install_azora_os
fi
