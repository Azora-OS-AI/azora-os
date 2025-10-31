/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

/**
 * AZORA IDE - ELECTRON PRELOAD SCRIPT
 * 
 * Secure bridge between main process and renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('azoraIDE', {
  // Elara integration
  elara: {
    query: (query: string) => ipcRenderer.invoke('elara:query', query),
    guidance: (question: string) => ipcRenderer.invoke('elara:guidance', question),
    getStatus: () => ipcRenderer.invoke('elara:getStatus')
  },

  // File system operations
  fs: {
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:writeFile', filePath, content),
    readDir: (dirPath: string) => ipcRenderer.invoke('fs:readDir', dirPath),
    createDir: (dirPath: string) => ipcRenderer.invoke('fs:createDir', dirPath),
    deleteFile: (filePath: string) => ipcRenderer.invoke('fs:deleteFile', filePath)
  },

  // Window management
  window: {
    create: (options: any) => ipcRenderer.invoke('window:create', options),
    close: () => ipcRenderer.invoke('window:close'),
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize')
  },

  // AI features
  ai: {
    generateCode: (request: any) => ipcRenderer.invoke('ai:generateCode', request),
    review: (code: string) => ipcRenderer.invoke('ai:review', code),
    refactor: (code: string, goals: string[]) => ipcRenderer.invoke('ai:refactor', code, goals),
    debug: (code: string, error: any) => ipcRenderer.invoke('ai:debug', code, error),
    generateTests: (code: string) => ipcRenderer.invoke('ai:generateTests', code),
    generateDocs: (code: string) => ipcRenderer.invoke('ai:generateDocs', code),
    optimize: (code: string) => ipcRenderer.invoke('ai:optimize', code)
  },

  // Terminal integration
  terminal: {
    execute: (command: string) => ipcRenderer.invoke('terminal:execute', command),
    create: () => ipcRenderer.invoke('terminal:create'),
    kill: (id: string) => ipcRenderer.invoke('terminal:kill', id)
  },

  // Git integration
  git: {
    status: () => ipcRenderer.invoke('git:status'),
    commit: (message: string) => ipcRenderer.invoke('git:commit', message),
    push: () => ipcRenderer.invoke('git:push'),
    pull: () => ipcRenderer.invoke('git:pull'),
    branch: (name: string) => ipcRenderer.invoke('git:branch', name)
  },

  // Event listeners
  on: {
    fileOpen: (callback: (filePath: string) => void) => {
      ipcRenderer.on('file:open', (_, filePath) => callback(filePath));
    },
    folderOpen: (callback: (folderPath: string) => void) => {
      ipcRenderer.on('folder:open', (_, folderPath) => callback(folderPath));
    },
    summonElara: (callback: () => void) => {
      ipcRenderer.on('summon-elara', callback);
    },
    aiMultiAgent: (callback: () => void) => {
      ipcRenderer.on('ai:multi-agent', callback);
    },
    commandPalette: (callback: () => void) => {
      ipcRenderer.on('command-palette', callback);
    }
  },

  // System info
  system: {
    platform: () => ipcRenderer.invoke('system:platform'),
    version: () => ipcRenderer.invoke('system:version'),
    arch: () => ipcRenderer.invoke('system:arch')
  }
});

// Type definitions for TypeScript
declare global {
  interface Window {
    azoraIDE: {
      elara: {
        query: (query: string) => Promise<any>;
        guidance: (question: string) => Promise<any>;
        getStatus: () => Promise<any>;
      };
      fs: {
        readFile: (filePath: string) => Promise<any>;
        writeFile: (filePath: string, content: string) => Promise<any>;
        readDir: (dirPath: string) => Promise<any>;
        createDir: (dirPath: string) => Promise<any>;
        deleteFile: (filePath: string) => Promise<any>;
      };
      window: {
        create: (options: any) => Promise<any>;
        close: () => Promise<any>;
        minimize: () => Promise<any>;
        maximize: () => Promise<any>;
      };
      ai: {
        generateCode: (request: any) => Promise<any>;
        review: (code: string) => Promise<any>;
        refactor: (code: string, goals: string[]) => Promise<any>;
        debug: (code: string, error: any) => Promise<any>;
        generateTests: (code: string) => Promise<any>;
        generateDocs: (code: string) => Promise<any>;
        optimize: (code: string) => Promise<any>;
      };
      terminal: {
        execute: (command: string) => Promise<any>;
        create: () => Promise<any>;
        kill: (id: string) => Promise<any>;
      };
      git: {
        status: () => Promise<any>;
        commit: (message: string) => Promise<any>;
        push: () => Promise<any>;
        pull: () => Promise<any>;
        branch: (name: string) => Promise<any>;
      };
      on: {
        fileOpen: (callback: (filePath: string) => void) => void;
        folderOpen: (callback: (folderPath: string) => void) => void;
        summonElara: (callback: () => void) => void;
        aiMultiAgent: (callback: () => void) => void;
        commandPalette: (callback: () => void) => void;
      };
      system: {
        platform: () => Promise<string>;
        version: () => Promise<string>;
        arch: () => Promise<string>;
      };
    };
  }
}
