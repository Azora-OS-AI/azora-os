---
name: Force Pull All Changes
type: knowledge
version: 1.0.0
agent: CodeActAgent
---

# Force Pull All Changes Microagent

This microagent provides comprehensive instructions for forcefully pulling all changes from a Git repository, including handling stuck files and resolving conflicts.

## Core Functionality

This microagent helps with:
- Forcefully pulling all remote changes
- Handling files that are stuck or have conflicts
- Resetting local changes when necessary
- Ensuring complete synchronization with remote repository

## Git Commands for Force Pulling

### 1. Basic Force Pull
```bash
git fetch origin
git reset --hard origin/main
```

### 2. Force Pull with Stuck Files
```bash
# Stash any local changes
git stash

# Fetch all remote changes
git fetch --all

# Reset hard to remote branch
git reset --hard origin/main

# Clean untracked files and directories
git clean -fd

# If files are still stuck, force clean
git clean -fxd
```

### 3. Complete Repository Reset
```bash
# Save current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Fetch all remote data
git fetch --all --prune

# Reset to remote branch completely
git reset --hard origin/$CURRENT_BRANCH

# Remove all untracked files and directories
git clean -fxd

# Ensure we're on the correct branch
git checkout $CURRENT_BRANCH
```

### 4. Handle Specific Stuck Files
```bash
# Check what files are causing issues
git status

# Force remove specific stuck files
git rm --cached <stuck-file>
git clean -f <stuck-file>

# Or remove all cached files and re-add
git rm -r --cached .
git add .
git commit -m "Reset all files"

# Then force pull
git fetch origin
git reset --hard origin/main
```

### 5. Nuclear Option - Complete Repository Refresh
```bash
# This completely resets everything to match remote
git fetch origin
git reset --hard origin/main
git clean -fxd
git submodule update --init --recursive --force
```

## Advanced Scenarios

### Handling Merge Conflicts During Force Pull
```bash
# Abort any ongoing merge
git merge --abort

# Reset to clean state
git reset --hard HEAD

# Force pull
git fetch origin
git reset --hard origin/main
```

### Dealing with Submodules
```bash
# Update submodules forcefully
git submodule foreach --recursive git reset --hard
git submodule update --init --recursive --force
```

### Branch-Specific Force Pull
```bash
# Force pull specific branch
git fetch origin <branch-name>
git reset --hard origin/<branch-name>
```

## Safety Considerations

⚠️ **Warning**: These commands will permanently delete local changes. Use with caution.

### Before Force Pulling
1. **Backup important changes**: 
   ```bash
   git stash push -m "backup before force pull"
   ```

2. **Check what will be lost**:
   ```bash
   git diff HEAD origin/main
   ```

3. **Create a backup branch**:
   ```bash
   git branch backup-$(date +%Y%m%d-%H%M%S)
   ```

## Troubleshooting Common Issues

### File Permission Issues
```bash
# Fix file permissions
chmod -R 755 .git
sudo chown -R $(whoami) .git
```

### Corrupted Repository
```bash
# Repair corrupted repository
git fsck --full
git gc --aggressive --prune=now
```

### Large Files or LFS Issues
```bash
# Handle Git LFS files
git lfs fetch --all
git lfs pull
```

## Complete Force Pull Script

Here's a comprehensive script that handles most scenarios:

```bash
#!/bin/bash

echo "🔄 Starting force pull of all changes..."

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Create backup branch
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
git branch $BACKUP_BRANCH
echo "💾 Created backup branch: $BACKUP_BRANCH"

# Abort any ongoing operations
git merge --abort 2>/dev/null || true
git rebase --abort 2>/dev/null || true
git cherry-pick --abort 2>/dev/null || true

# Stash any local changes
git stash push -m "Auto-stash before force pull" 2>/dev/null || true

# Fetch all remote data
echo "📥 Fetching all remote data..."
git fetch --all --prune

# Reset hard to remote branch
echo "🔄 Resetting to remote branch..."
git reset --hard origin/$CURRENT_BRANCH

# Clean all untracked files and directories
echo "🧹 Cleaning untracked files..."
git clean -fxd

# Update submodules if they exist
if [ -f .gitmodules ]; then
    echo "📦 Updating submodules..."
    git submodule foreach --recursive git reset --hard
    git submodule update --init --recursive --force
fi

# Handle Git LFS if present
if git lfs ls-files >/dev/null 2>&1; then
    echo "📁 Updating LFS files..."
    git lfs fetch --all
    git lfs pull
fi

echo "✅ Force pull completed successfully!"
echo "🔍 Repository status:"
git status --short
```

## Usage Examples

### Quick Force Pull
```bash
git fetch origin && git reset --hard origin/main && git clean -fd
```

### Safe Force Pull with Backup
```bash
git branch backup-$(date +%Y%m%d-%H%M%S) && git fetch origin && git reset --hard origin/main
```

### Force Pull Specific Files
```bash
git checkout origin/main -- path/to/specific/file
```

This microagent ensures that all changes are pulled from the remote repository, even when files are stuck or conflicts exist. The commands provided will forcefully synchronize the local repository with the remote state.