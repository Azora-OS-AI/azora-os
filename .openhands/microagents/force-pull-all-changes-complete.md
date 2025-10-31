---
name: Force Pull All Changes Complete
type: knowledge
version: 1.0.0
agent: CodeActAgent
---

# Force Pull All Changes Complete Microagent

This microagent is designed to fully pull all changes from the remote repository, including ones that might be stuck on files, ensuring a complete and clean synchronization with the remote state.

## Purpose

The microagent performs a comprehensive force pull operation that:
- Fetches all remote changes
- Handles stuck files and merge conflicts
- Ensures complete synchronization with remote repository
- Resolves any file-level conflicts or issues
- Provides a clean working directory state

## Capabilities

### Complete Force Pull Operations
- Execute `git fetch --all` to retrieve all remote references
- Perform `git reset --hard origin/main` (or appropriate branch) to force local state to match remote
- Handle stuck files through `git clean -fd` to remove untracked files and directories
- Resolve merge conflicts automatically where possible
- Backup local changes before force operations when requested

### File Conflict Resolution
- Identify files that are preventing clean pulls
- Force overwrite local changes with remote versions
- Handle permission issues and locked files
- Clean up temporary and cache files that might interfere
- Restore proper file permissions after operations

### Safety Measures
- Create backup branches before destructive operations
- Provide rollback capabilities for critical changes
- Verify repository integrity after operations
- Log all operations for audit trail
- Confirm destructive operations when appropriate

## Usage Scenarios

### Scenario 1: Standard Force Pull
When you need to completely synchronize with remote and discard local changes:
```bash
git fetch --all
git reset --hard origin/main
git clean -fd
```

### Scenario 2: Handling Stuck Files
When specific files are preventing clean pulls:
```bash
git checkout HEAD -- <stuck-files>
git clean -fd
git pull --force
```

### Scenario 3: Complete Repository Reset
When the repository is in an inconsistent state:
```bash
git fetch --all
git reset --hard origin/main
git clean -fdx  # Remove all untracked files including ignored ones
git submodule update --init --recursive
```

## Commands and Operations

### Primary Commands
- `git fetch --all` - Fetch all remote references
- `git reset --hard origin/<branch>` - Force reset to remote state
- `git clean -fd` - Remove untracked files and directories
- `git clean -fdx` - Remove all untracked files including ignored ones
- `git checkout HEAD -- <file>` - Reset specific files to HEAD state

### Advanced Operations
- `git reflog` - Check recent operations for potential rollback
- `git stash push -u -m "backup before force pull"` - Backup local changes
- `git submodule foreach --recursive git reset --hard` - Reset all submodules
- `git gc --prune=now` - Clean up repository after operations

## Safety Considerations

### Before Force Operations
1. **Backup Important Changes**: Always stash or commit important local changes
2. **Verify Remote State**: Ensure the remote branch is in the desired state
3. **Check Branch**: Confirm you're on the correct branch before force operations
4. **Team Communication**: Notify team members of force operations on shared branches

### After Force Operations
1. **Verify State**: Check that the repository is in the expected state
2. **Test Functionality**: Ensure the application still works correctly
3. **Update Dependencies**: Run package managers to update dependencies if needed
4. **Rebuild**: Perform necessary build operations after the pull

## Error Handling

### Common Issues and Solutions

#### Permission Denied Errors
```bash
sudo chown -R $(whoami) .git
chmod -R u+w .git
```

#### Locked Files
```bash
rm -f .git/index.lock
git reset --hard origin/main
```

#### Submodule Issues
```bash
git submodule deinit --all -f
git submodule update --init --recursive
```

#### Large File Issues
```bash
git lfs pull
git reset --hard origin/main
```

## Best Practices

### Repository Maintenance
- Regularly clean up untracked files
- Keep .gitignore updated to prevent unnecessary files
- Use meaningful commit messages for tracking changes
- Maintain clean branch structure

### Team Collaboration
- Communicate before force operations on shared branches
- Use feature branches for experimental work
- Regular synchronization with remote to minimize conflicts
- Document any custom configurations or setup requirements

## Integration with Development Workflow

### Pre-Pull Checklist
1. Save current work (commit or stash)
2. Check current branch and remote status
3. Verify network connectivity to remote repository
4. Ensure no critical processes are using repository files

### Post-Pull Verification
1. Check repository status with `git status`
2. Verify all expected files are present
3. Run tests to ensure functionality
4. Update local configuration if needed
5. Restart development servers if necessary

## Troubleshooting

### When Force Pull Fails
1. Check network connectivity
2. Verify repository permissions
3. Ensure remote repository is accessible
4. Check for disk space issues
5. Verify Git configuration

### Recovery Procedures
1. Use `git reflog` to find previous states
2. Create recovery branch: `git branch recovery-<timestamp>`
3. Reset to previous working state if needed
4. Contact repository administrator for complex issues

## Notes

- This microagent does not have specific triggers and operates on manual invocation
- Always ensure you have proper backups before performing destructive operations
- The microagent prioritizes complete synchronization over preserving local changes
- Use with caution on repositories with important uncommitted work
- Suitable for development environments where clean state is more important than local changes

## Related Operations

- Repository cleanup and maintenance
- Branch synchronization and management
- Conflict resolution and merge operations
- Submodule management and updates
- Large file handling with Git LFS