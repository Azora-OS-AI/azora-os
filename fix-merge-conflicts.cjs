#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find all package.json files with merge conflicts
const conflictFiles = [
  '/workspace/project/azora-os/services/azora-mint/package.json',
  '/workspace/project/azora-os/services/azora-aegis/package.json',
  '/workspace/project/azora-os/services/azora-oracle/package.json',
  '/workspace/project/azora-os/unified-ui/src/components/ui/package.json',
  '/workspace/project/azora-os/azora/azora-mint-mine-engine-next/package.json',
  '/workspace/project/azora-os/azora/azora-ui/package.json',
  '/workspace/project/azora-os/synapse/vigil-ui/package.json',
  '/workspace/project/azora-os/synapse/academy-ui/package.json'
];

function fixMergeConflicts(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove merge conflict markers and keep the clean-branch version
    content = content.replace(/<<<<<<< HEAD\n[\s\S]*?=======\n([\s\S]*?)>>>>>>> clean-branch/g, '$1');
    
    // Also handle cases where HEAD version should be kept
    content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>> clean-branch/g, '$1');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed merge conflicts in: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

conflictFiles.forEach(fixMergeConflicts);
console.log('Merge conflict resolution complete!');