# Azora OS Cross-Platform Development Setup

This directory contains automated installation scripts for setting up the Azora OS development environment on Windows, Linux, and macOS.

## Platform-Specific Installation

### Windows

You can install the development environment on Windows using either the batch script or PowerShell script:

**Option 1: Batch Script (Recommended)**
```cmd
install-windows.bat
```

**Option 2: PowerShell Script**
```powershell
.\install-windows.ps1
```

### Linux

Run the Linux installation script:
```bash
chmod +x install-linux.sh
./install-linux.sh
```

### macOS

Run the macOS installation script:
```bash
chmod +x install-macos.sh
./install-macos.sh
```

## Universal Installation

For a platform-detecting installation, run:
```bash
chmod +x install.sh
./install.sh
```

## What's Installed

The installation scripts will automatically:

1. Check for and install Node.js (v22 LTS)
2. Check for and install Git
3. Install project dependencies using pnpm
4. Set up environment variables
5. Create desktop shortcuts/aliases for easy access
6. Configure the development environment according to constitutional principles

## Constitutional Compliance

All installation scripts ensure constitutional compliance by:
- Maintaining infrastructure independence
- Preserving African ownership principles
- Enabling student empowerment mechanisms
- Following the No Mock Protocol
- Ensuring transparent economics

## Post-Installation

After running the installation script:

1. Open a new terminal/command prompt
2. Navigate to the project directory
3. Run `npm run dev` to start the development server
4. Visit `http://localhost:3000` in your browser

For constitutional compliance verification, run:
```bash
node verify-constitutional-compliance.js
```

## Troubleshooting

If you encounter any issues during installation:

1. Ensure you have administrator/root privileges
2. Check that your system meets the minimum requirements
3. Verify that no antivirus software is blocking the installation
4. Run the constitutional compliance checker to identify any issues

For additional support, contact the Azora ES team at hello@azora.world.

---

*From Africa, For Humanity, Towards Infinity* 🇿🇦