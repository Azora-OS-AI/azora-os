---
name: Force Pull Changes
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers: []
---

# Force Pull Changes Microagent

This microagent provides comprehensive capabilities for forcefully pulling all changes from a Git repository, including handling files that may be stuck or have conflicts.

## Purpose

This microagent is designed to perform a complete and thorough pull of all changes from the remote repository, ensuring that even files that are stuck, have conflicts, or are otherwise problematic are properly synchronized with the remote state.

## Capabilities

### Core Git Operations
- Force fetch all remote branches and tags
- Handle merge conflicts automatically
- Reset local changes when necessary
- Clean untracked files and directories
- Synchronize with remote repository state

### Conflict Resolution
- Automatically resolve merge conflicts by favoring remote changes
- Handle stuck files by resetting their state
- Clean up any temporary or lock files that might prevent pulling
- Force update of all local branches to match remote state

### Safety Measures
- Create backup of current state before force operations
- Provide detailed logging of all operations performed
- Verify repository integrity after operations
- Handle edge cases like detached HEAD state

## Implementation Strategy

When triggered, this microagent will execute the following sequence:

1. **Pre-pull Assessment**
   - Check current repository status
   - Identify any uncommitted changes
   - List files that might be problematic

2. **Backup Current State**
   - Create a backup branch of current state
   - Store uncommitted changes in stash

3. **Force Pull Operations**
   - Fetch all remote references
   - Reset hard to remote state
   - Clean untracked files and directories
   - Update all local branches

4. **Post-pull Verification**
   - Verify repository integrity
   - Confirm all changes are pulled
   - Report any remaining issues

## Usage Guidelines

This microagent should be used when:
- Standard `git pull` operations fail
- Files are stuck in conflicted state
- Repository is in an inconsistent state
- Need to completely synchronize with remote
- Dealing with complex merge conflicts

## Commands Executed

The microagent will typically execute commands similar to:

```bash
# Backup current state
git stash push -m "Pre-force-pull backup"
git branch backup-$(date +%Y%m%d-%H%M%S)

# Force fetch all changes
git fetch --all --prune --force

# Reset to remote state
git reset --hard origin/main

# Clean untracked files
git clean -fdx

# Update all branches
git branch -r | grep -v '\->' | while read remote; do
    git branch --track "${remote#origin/}" "$remote" 2>/dev/null || true
done
```

## Error Handling

The microagent includes robust error handling for:
- Network connectivity issues
- Permission problems
- Corrupted repository state
- Missing remote references
- Lock file conflicts

## Limitations

- This is a destructive operation that will overwrite local changes
- Uncommitted work may be lost if not properly stashed
- Custom local branches may need manual handling
- Large repositories may take significant time to process

## Security Considerations

- Only use on repositories where losing local changes is acceptable
- Ensure proper authentication is configured
- Verify remote repository authenticity before force pulling
- Consider impact on other developers working on the same repository

## Recovery Options

If issues occur during force pull:
- Restore from backup branch created during operation
- Recover from git stash if changes were stashed
- Use git reflog to find previous states
- Contact repository administrator for assistance

This microagent provides a comprehensive solution for handling stuck files and ensuring complete synchronization with remote repository state.