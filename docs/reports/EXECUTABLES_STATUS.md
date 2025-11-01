# AZORA OS - Executable Files Status

## Current Status

**No .exe files found in the repository** - The repository currently does not contain any built executables.

## Build Scripts Available

I've created the following tools to help you build executables:

### 1. `build-exe-for-testing.bat`
   - Windows batch script to build executables
   - Installs Electron and electron-builder
   - Creates Windows .exe files
   - Usage: `.\build-exe-for-testing.bat` or `npm run build:exe`

### 2. `scripts/build-test-executables.ts`
   - TypeScript script for building executables
   - More flexible than batch script
   - Usage: `npm run build:exe:ts`

### 3. `find-executables.ps1`
   - PowerShell script to search for executables
   - Searches for .exe, .app, .msi, .dmg, .deb, .rpm files
   - Excludes node_modules and .git directories

## To Build Executables

1. **Install dependencies** (if needed):
   ```bash
   npm install --save-dev electron electron-builder --legacy-peer-deps
   ```

2. **Run the build script**:
   ```bash
   npm run build:exe
   ```
   or
   ```bash
   .\build-exe-for-testing.bat
   ```

3. **Check for output**:
   - Windows executables will be in `dist/win-unpacked/`
   - The executable will be named something like `Azora OS.exe`

## Expected Output Locations

After building, executables should appear in:
- `dist/win-unpacked/` - Windows unpacked application
- `dist/` - Compiled executables
- May also create installer files (.msi, .exe installer)

## Notes

- The build process requires Electron to be installed
- You may need to run `npm install` first to resolve dependencies
- The build scripts will create necessary Electron main files if they don't exist
- For testing, you can run the Next.js dev server and use Electron to wrap it

## Quick Test Commands

```bash
# Search for executables
powershell -ExecutionPolicy Bypass -File find-executables.ps1

# Build executables
npm run build:exe

# Or use the TypeScript version
npm run build:exe:ts
```

