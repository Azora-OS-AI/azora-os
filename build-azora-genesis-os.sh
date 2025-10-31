#!/bin/bash
################################################################################
# AZORA GENESIS OS - MASTER BUILD SCRIPT
# Transform Ubuntu 24.04 LTS into Azora Genesis OS
#
# AZORA PROPRIETARY LICENSE
# Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_DIR="$HOME/azora-genesis-os"
UBUNTU_VERSION="24.04"
ISO_URL="https://releases.ubuntu.com/${UBUNTU_VERSION}/ubuntu-${UBUNTU_VERSION}-desktop-amd64.iso"

echo -e "${BLUE}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          AZORA GENESIS OS - BUILD SYSTEM                    ║
║                                                              ║
║        Transform Ubuntu into Azora Genesis OS               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to print status messages
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Phase 1: Setup
phase1_setup() {
    print_info "Phase 1: Setting up development environment..."
    
    # Create project directory
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    print_status "Created project directory: $PROJECT_DIR"
    
    # Install required tools
    print_info "Installing build tools..."
    sudo apt update
    sudo apt install -y \
        git \
        build-essential \
        squashfs-tools \
        xorriso \
        isolinux \
        syslinux-utils \
        genisoimage \
        debootstrap \
        schroot \
        ubuntu-dev-tools \
        grub-pc-bin \
        grub-efi-amd64-bin \
        imagemagick \
        nodejs \
        npm
    
    print_status "Build tools installed"
    
    # Create directory structure
    mkdir -p {
        iso-build,
        customization/{branding,plymouth,themes,wallpapers,scripts},
        apps,
        kernel-modules,
        build-output
    }
    print_status "Directory structure created"
}

# Phase 2: Download Ubuntu
phase2_download() {
    print_info "Phase 2: Downloading Ubuntu ${UBUNTU_VERSION} LTS..."
    
    cd "$PROJECT_DIR"
    
    if [ -f "ubuntu-${UBUNTU_VERSION}-desktop-amd64.iso" ]; then
        print_warning "Ubuntu ISO already downloaded, skipping..."
    else
        print_info "Downloading Ubuntu ISO (this may take a while)..."
        wget -c "$ISO_URL" -O "ubuntu-${UBUNTU_VERSION}-desktop-amd64.iso"
        print_status "Ubuntu ISO downloaded"
    fi
}

# Phase 3: Extract and prepare ISO
phase3_extract() {
    print_info "Phase 3: Extracting Ubuntu ISO..."
    
    cd "$PROJECT_DIR"
    
    # Mount original ISO
    mkdir -p iso-original iso-custom
    
    if mountpoint -q iso-original; then
        sudo umount iso-original
    fi
    
    sudo mount -o loop "ubuntu-${UBUNTU_VERSION}-desktop-amd64.iso" iso-original
    print_status "Ubuntu ISO mounted"
    
    # Copy to custom directory
    print_info "Copying ISO contents (this may take a few minutes)..."
    sudo rsync -a --info=progress2 iso-original/ iso-custom/
    
    sudo umount iso-original
    print_status "ISO extracted to iso-custom/"
}

# Phase 4: Apply Azora branding
phase4_branding() {
    print_info "Phase 4: Applying Azora branding..."
    
    cd "$PROJECT_DIR"
    
    # Create branding directory structure
    sudo mkdir -p iso-custom/usr/share/azora/{branding,wallpapers,icons,sounds}
    
    # Create Azora info file
    sudo tee iso-custom/etc/azora-release > /dev/null << 'EOF'
AZORA_CODENAME="Genesis"
AZORA_VERSION="1.0.0"
AZORA_BUILD="$(date +%Y%m%d)"
AZORA_DESCRIPTION="Azora Genesis OS - The Future of Computing"
EOF
    
    # Modify os-release
    sudo tee iso-custom/etc/os-release > /dev/null << 'EOF'
NAME="Azora Genesis OS"
VERSION="1.0 (Genesis)"
ID=azora
ID_LIKE=ubuntu
PRETTY_NAME="Azora Genesis OS 1.0"
VERSION_ID="1.0"
HOME_URL="https://azora.world/"
SUPPORT_URL="https://support.azora.world/"
BUG_REPORT_URL="https://github.com/Sizwe780/azora-os/issues"
PRIVACY_POLICY_URL="https://azora.world/privacy"
VERSION_CODENAME=genesis
UBUNTU_CODENAME=noble
EOF
    
    print_status "Azora branding applied"
}

# Phase 5: Create custom wallpapers
phase5_wallpapers() {
    print_info "Phase 5: Creating Azora wallpapers..."
    
    cd "$PROJECT_DIR/customization/wallpapers"
    
    # Create gradient wallpaper
    convert -size 3840x2160 \
        gradient:"#0a0a0a-#1a1a1a" \
        -font DejaVu-Sans-Bold -pointsize 120 \
        -fill "#3b82f6" -gravity center \
        -annotate +0-100 "AZORA GENESIS OS" \
        -fill "#ffffff" -pointsize 60 \
        -annotate +0+100 "From Africa, For Humanity, Towards Infinity" \
        azora-default.png
    
    # Create blurred version for login
    convert azora-default.png -blur 0x8 azora-login.png
    
    # Copy to ISO
    sudo mkdir -p iso-custom/usr/share/backgrounds/azora
    sudo cp *.png iso-custom/usr/share/backgrounds/azora/
    
    print_status "Wallpapers created"
}

# Phase 6: Create Plymouth theme (boot splash)
phase6_plymouth() {
    print_info "Phase 6: Creating boot splash screen..."
    
    cd "$PROJECT_DIR/customization/plymouth"
    
    # Create Plymouth theme directory
    mkdir -p azora
    
    # Create theme definition
    cat > azora/azora.plymouth << 'EOF'
[Plymouth Theme]
Name=Azora Genesis OS
Description=Azora Genesis OS boot screen
ModuleName=script

[script]
ImageDir=/usr/share/plymouth/themes/azora
ScriptFile=/usr/share/plymouth/themes/azora/azora.script
EOF
    
    # Create boot animation
    cat > azora/azora.script << 'EOF'
Window.SetBackgroundTopColor(0.10, 0.10, 0.10);
Window.SetBackgroundBottomColor(0.05, 0.05, 0.05);

message_sprite = Sprite();
message_sprite.SetPosition(Window.GetX() + Window.GetWidth()  / 2,
                          Window.GetY() + Window.GetHeight() / 2, 10000);

fun message_callback(text) {
  my_image = Image.Text(text, 1, 1, 1);
  message_sprite.SetImage(my_image);
}

Plymouth.SetMessageFunction(message_callback);

progress = 0;
fun progress_callback(duration, progress) {
  # Add progress indicator
}

Plymouth.SetBootProgressFunction(progress_callback);
EOF
    
    # Copy to ISO
    sudo mkdir -p iso-custom/usr/share/plymouth/themes/azora
    sudo cp -r azora/* iso-custom/usr/share/plymouth/themes/azora/
    
    print_status "Plymouth theme created"
}

# Phase 7: Integrate Azora apps
phase7_integrate_apps() {
    print_info "Phase 7: Integrating Azora applications..."
    
    cd "$PROJECT_DIR"
    
    # Copy Azora apps from workspace
    sudo mkdir -p iso-custom/usr/share/azora-apps
    
    if [ -d "/workspace/azora" ]; then
        sudo cp -r /workspace/azora iso-custom/usr/share/azora-apps/
        print_status "Azora main app integrated"
    fi
    
    if [ -d "/workspace/azora-mint" ]; then
        sudo cp -r /workspace/azora-mint iso-custom/usr/share/azora-apps/
        print_status "Azora Mint integrated"
    fi
    
    if [ -d "/workspace/azora-sapiens" ]; then
        sudo cp -r /workspace/azora-sapiens iso-custom/usr/share/azora-apps/
        print_status "Azora Sapiens integrated"
    fi
    
    if [ -d "/workspace/elara-family" ]; then
        sudo cp -r /workspace/elara-family iso-custom/usr/share/azora-apps/
        print_status "Elara AI integrated"
    fi
    
    # Create installation script
    sudo tee iso-custom/usr/share/azora-apps/install.sh > /dev/null << 'EOF'
#!/bin/bash
# Azora Apps First-Boot Installation

echo "Installing Azora Genesis OS Applications..."

# Install Node.js dependencies
cd /usr/share/azora-apps
for app in */; do
    if [ -f "$app/package.json" ]; then
        echo "Installing $app..."
        cd "$app"
        npm install --production 2>/dev/null || true
        cd ..
    fi
done

# Create desktop entries
mkdir -p ~/.local/share/applications

cat > ~/.local/share/applications/azora-education.desktop << 'DESKTOP'
[Desktop Entry]
Name=Azora Education
Comment=Complete Education Platform with Proof-of-Knowledge
Exec=node /usr/share/azora-apps/azora-sapiens/src/server.ts
Icon=/usr/share/azora/icons/education.svg
Terminal=false
Type=Application
Categories=Education;
DESKTOP

cat > ~/.local/share/applications/azora-wallet.desktop << 'DESKTOP'
[Desktop Entry]
Name=Azora Wallet
Comment=Cryptocurrency Wallet & Financial Services
Exec=node /usr/share/azora-apps/azora-mint/src/server.ts
Icon=/usr/share/azora/icons/wallet.svg
Terminal=false
Type=Application
Categories=Finance;
DESKTOP

cat > ~/.local/share/applications/elara-ai.desktop << 'DESKTOP'
[Desktop Entry]
Name=Elara AI Assistant
Comment=Your AI-Powered Desktop Assistant
Exec=node /usr/share/azora-apps/elara-family/core/family-coordinator.ts
Icon=/usr/share/azora/icons/elara.svg
Terminal=false
Type=Application
Categories=Utility;
DESKTOP

echo "✅ Azora apps installed!"
EOF
    
    sudo chmod +x iso-custom/usr/share/azora-apps/install.sh
    print_status "Azora apps integrated"
}

# Phase 8: Configure GNOME settings
phase8_gnome_settings() {
    print_info "Phase 8: Configuring GNOME settings..."
    
    sudo mkdir -p iso-custom/usr/share/glib-2.0/schemas
    
    sudo tee iso-custom/usr/share/glib-2.0/schemas/99-azora-genesis.gschema.override > /dev/null << 'EOF'
[org.gnome.desktop.background]
picture-uri='file:///usr/share/backgrounds/azora/azora-default.png'
picture-uri-dark='file:///usr/share/backgrounds/azora/azora-default.png'
primary-color='#0a0a0a'
secondary-color='#1a1a1a'

[org.gnome.desktop.screensaver]
picture-uri='file:///usr/share/backgrounds/azora/azora-login.png'
primary-color='#0a0a0a'

[org.gnome.desktop.interface]
color-scheme='prefer-dark'
gtk-theme='Yaru-blue-dark'
icon-theme='Yaru-blue'
cursor-theme='Yaru'
font-name='Ubuntu 11'
document-font-name='Ubuntu 11'
monospace-font-name='Ubuntu Mono 13'

[org.gnome.shell]
favorite-apps=['firefox.desktop', 'azora-education.desktop', 'azora-wallet.desktop', 'elara-ai.desktop', 'org.gnome.Nautilus.desktop', 'org.gnome.Terminal.desktop']

[org.gnome.desktop.wm.preferences]
button-layout='close,minimize,maximize:appmenu'
theme='Yaru-blue-dark'

[org.gnome.desktop.session]
idle-delay=uint32 900
EOF
    
    print_status "GNOME settings configured"
}

# Phase 9: Build final ISO
phase9_build_iso() {
    print_info "Phase 9: Building final ISO..."
    
    cd "$PROJECT_DIR/iso-custom"
    
    # Compile GSettings schemas
    sudo glib-compile-schemas usr/share/glib-2.0/schemas/ 2>/dev/null || true
    
    # Update manifest
    sudo find . -type f -print0 | xargs -0 md5sum | sudo tee md5sum.txt > /dev/null
    
    cd "$PROJECT_DIR"
    
    # Generate ISO
    print_info "Generating ISO (this may take several minutes)..."
    
    sudo xorriso -as mkisofs \
        -r -V "Azora Genesis OS 1.0" \
        -J -joliet-long \
        -cache-inodes \
        -b isolinux/isolinux.bin \
        -c isolinux/boot.cat \
        -no-emul-boot \
        -boot-load-size 4 \
        -boot-info-table \
        -eltorito-alt-boot \
        -e boot/grub/efi.img \
        -no-emul-boot \
        -isohybrid-gpt-basdat \
        -isohybrid-apm-hfsplus \
        -isohybrid-mbr /usr/lib/ISOLINUX/isohdpfx.bin \
        -o "build-output/azora-genesis-os-1.0-amd64.iso" \
        iso-custom/
    
    # Make ISO bootable on USB
    sudo isohybrid build-output/azora-genesis-os-1.0-amd64.iso 2>/dev/null || true
    
    print_status "ISO built successfully!"
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Azora Genesis OS ISO ready!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}Location:${NC} $PROJECT_DIR/build-output/azora-genesis-os-1.0-amd64.iso"
    echo -e "${BLUE}Size:${NC} $(du -h "$PROJECT_DIR/build-output/azora-genesis-os-1.0-amd64.iso" | cut -f1)"
    echo ""
}

# Phase 10: Create bootable USB script
phase10_usb_creator() {
    print_info "Phase 10: Creating USB creator script..."
    
    cat > "$PROJECT_DIR/build-output/create-bootable-usb.sh" << 'EOF'
#!/bin/bash
# Azora Genesis OS - USB Creator

echo "Azora Genesis OS - Bootable USB Creator"
echo "========================================"
echo ""
echo "⚠️  WARNING: This will ERASE all data on the selected drive!"
echo ""

# List available drives
lsblk -d -n -p -o NAME,SIZE,TYPE | grep disk

echo ""
read -p "Enter the device path (e.g., /dev/sdb): " DEVICE

if [ ! -b "$DEVICE" ]; then
    echo "Error: Device not found!"
    exit 1
fi

echo ""
echo "You selected: $DEVICE"
echo "This will ERASE all data on this drive!"
read -p "Are you sure? Type 'YES' to continue: " CONFIRM

if [ "$CONFIRM" != "YES" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Creating bootable USB..."

sudo dd if=azora-genesis-os-1.0-amd64.iso of=$DEVICE bs=4M status=progress conv=fsync

sync

echo ""
echo "✅ Bootable USB created successfully!"
echo "You can now boot from this USB drive."
EOF
    
    chmod +x "$PROJECT_DIR/build-output/create-bootable-usb.sh"
    print_status "USB creator script created"
}

# Main execution
main() {
    echo ""
    print_info "Starting Azora Genesis OS build process..."
    echo ""
    
    # Check for sudo access
    sudo -v
    
    # Execute phases
    phase1_setup
    echo ""
    
    phase2_download
    echo ""
    
    phase3_extract
    echo ""
    
    phase4_branding
    echo ""
    
    phase5_wallpapers
    echo ""
    
    phase6_plymouth
    echo ""
    
    phase7_integrate_apps
    echo ""
    
    phase8_gnome_settings
    echo ""
    
    phase9_build_iso
    echo ""
    
    phase10_usb_creator
    echo ""
    
    # Final summary
    echo -e "${BLUE}"
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║               BUILD COMPLETE! 🎉                             ║
║                                                              ║
║          Azora Genesis OS is ready to deploy!               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo ""
    echo -e "${GREEN}Next Steps:${NC}"
    echo ""
    echo "1. Test in VirtualBox:"
    echo "   • Install VirtualBox"
    echo "   • Create new VM (Ubuntu 64-bit, 4GB RAM, 50GB disk)"
    echo "   • Mount the ISO and boot"
    echo ""
    echo "2. Create bootable USB:"
    echo "   • Run: cd $PROJECT_DIR/build-output"
    echo "   • Run: ./create-bootable-usb.sh"
    echo ""
    echo "3. Distribute:"
    echo "   • Upload to website"
    echo "   • Create torrent"
    echo "   • Share with beta testers"
    echo ""
    echo -e "${BLUE}ISO Location:${NC}"
    echo "  $PROJECT_DIR/build-output/azora-genesis-os-1.0-amd64.iso"
    echo ""
    echo -e "${GREEN}🌍 From Africa, For Humanity, Towards Infinity 🇿🇦${NC}"
    echo ""
}

# Run main function
main "$@"
