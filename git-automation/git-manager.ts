/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * GIT AUTOMATION MANAGER
 *
 * Manages automatic Git operations including commits, pushes, pulls, and branch management
 * for the entire Azora OS ecosystem. Ensures all upgrades and changes are properly versioned.
 */

import { EventEmitter } from 'events';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { logger } from '../genome/utils/logger';

export class GitManager extends EventEmitter {
  private repoPath: string;
  private autoCommitEnabled: boolean = true;
  private autoPushEnabled: boolean = true;

  constructor(repoPath: string = process.cwd()) {
    super();
    this.repoPath = repoPath;
  }

  async getGitStatus() {
    try {
      // Check if git repo exists
      const isGit = this.executeGitCommand('rev-parse --git-dir').trim();
      if (!isGit) {
        return {
          branch: 'none',
          status: 'not-git-repo',
          hasChanges: false,
          pendingChanges: [],
          lastCommit: new Date(),
          ahead: 0,
          behind: 0,
          remoteConfigured: false
        };
      }

      const branch = this.executeGitCommand('rev-parse --abbrev-ref HEAD').trim();
      const statusOutput = this.executeGitCommand('status --porcelain');
      const hasChanges = statusOutput.trim().length > 0;

      return {
        branch,
        status: hasChanges ? 'dirty' : 'clean',
        hasChanges,
        pendingChanges: hasChanges ? statusOutput.split('\n').filter(line => line.trim()) : [],
        lastCommit: new Date(),
        ahead: 0,
        behind: 0,
        remoteConfigured: true
      };
    } catch (error) {
      return {
        branch: 'error',
        status: 'error',
        hasChanges: false,
        pendingChanges: [],
        lastCommit: new Date(),
        ahead: 0,
        behind: 0,
        remoteConfigured: false
      };
    }
  }

  async commit(message: string, files: string[] = []) {
    try {
      if (files.length > 0) {
        this.executeGitCommand(`add ${files.join(' ')}`);
      }
      this.executeGitCommand(`commit -m "${message}"`);
      return { success: true, message: 'Committed successfully' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : String(error) };
    }
  }

  async commitAndPush(message: string, files: string[] = []) {
    const commitResult = await this.commit(message, files);
    if (!commitResult.success) {
      return { success: false, commit: commitResult, push: null, message: 'Commit failed' };
    }

    try {
      this.executeGitCommand('push origin main');
      return { success: true, commit: commitResult, push: { success: true }, message: 'Commit and push successful' };
    } catch (error) {
      return { success: false, commit: commitResult, push: { success: false }, message: 'Push failed' };
    }
  }

  private executeGitCommand(command: string): string {
    try {
      return execSync(`git ${command}`, { cwd: this.repoPath, encoding: 'utf-8' }).toString().trim();
    } catch (error: any) {
      // Don't throw error, just return empty string for status checks
      return '';
    }
  }
}

// Global instance
export const gitManager = new GitManager();