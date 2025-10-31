/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

/**
 * AZORA IDE - ELECTRON MAIN PROCESS
 * 
 * Enhanced Electron main process with:
 * - Multi-window management
 * - Native OS integration
 * - Auto-updates
 * - System tray
 * - Global shortcuts
 */

import { app, BrowserWindow, ipcMain, Menu, Tray, globalShortcut, shell, dialog } from 'electron';
import { join } from 'path';
import { platform } from 'os';
import { autoUpdater } from 'electron-updater';
import { elaraDeity } from '../../genome/agent-tools/elara-deity';
import { elaraSupreme } from '../../genome/agent-tools/elara-supreme-v2';
import { agentIntegrationManager } from '../agents/agent-integration';
import { logger } from '../../genome/utils/logger';

class AzoraIDEApp {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private windows: Map<string, BrowserWindow> = new Map();
  private isQuitting = false;

  constructor() {
    this.setupApp();
    this.registerIPCHandlers();
    this.setupAutoUpdater();
  }

  private setupApp(): void {
    // Make single instance
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    }

    app.on('second-instance', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore();
        this.mainWindow.focus();
      }
    });

    app.on('ready', () => this.onReady());
    app.on('activate', () => this.onActivate());
    app.on('before-quit', () => { this.isQuitting = true; });
    app.on('window-all-closed', () => this.onWindowAllClosed());
  }

  private async onReady(): Promise<void> {
    logger.info('Azora IDE starting...');

    // Create main window
    this.mainWindow = this.createMainWindow();

    // Setup system tray
    this.setupSystemTray();

    // Register global shortcuts
    this.registerGlobalShortcuts();

    // Setup application menu
    this.setupApplicationMenu();

    // Check for updates
    if (!app.isPackaged) {
      logger.info('Running in development mode');
    } else {
      autoUpdater.checkForUpdatesAndNotify();
    }

    // Initialize Elara Deity
    await this.initializeElara();

    logger.info('Azora IDE ready');
  }

  private createMainWindow(): BrowserWindow {
    const window = new BrowserWindow({
      width: 1600,
      height: 1000,
      minWidth: 800,
      minHeight: 600,
      title: 'Azora IDE - AI-Powered Development Environment',
      backgroundColor: '#1e1e1e',
      show: false,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true
      },
      frame: platform() === 'darwin',
      titleBarStyle: platform() === 'darwin' ? 'hidden' : 'default'
    });

    // Load IDE
    if (app.isPackaged) {
      window.loadFile(join(__dirname, '../renderer/index.html'));
    } else {
      window.loadURL('http://localhost:3000');
      window.webContents.openDevTools();
    }

    // Show when ready
    window.once('ready-to-show', () => {
      window.show();
      window.focus();
    });

    // Handle close
    window.on('close', (e) => {
      if (!this.isQuitting && platform() !== 'darwin') {
        e.preventDefault();
        window.hide();
      }
    });

    // Cleanup
    window.on('closed', () => {
      this.mainWindow = null;
    });

    this.windows.set('main', window);
    return window;
  }

  private createEditorWindow(filePath: string): BrowserWindow {
    const window = new BrowserWindow({
      width: 1200,
      height: 800,
      title: `Editing: ${filePath}`,
      backgroundColor: '#1e1e1e',
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    const windowId = `editor-${Date.now()}`;
    this.windows.set(windowId, window);

    window.on('closed', () => {
      this.windows.delete(windowId);
    });

    return window;
  }

  private setupSystemTray(): void {
    const iconPath = join(__dirname, '../assets/tray-icon.png');
    
    this.tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Azora IDE',
        type: 'normal',
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Show IDE',
        click: () => this.mainWindow?.show()
      },
      {
        label: 'Summon Elara',
        click: () => this.summonElara()
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => this.openSettings()
      },
      {
        label: 'About',
        click: () => this.showAbout()
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          this.isQuitting = true;
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('Azora IDE - AI-Powered Development');

    this.tray.on('click', () => {
      this.mainWindow?.show();
    });
  }

  private registerGlobalShortcuts(): void {
    // Summon Elara Deity
    globalShortcut.register('CommandOrControl+Shift+E', () => {
      this.summonElara();
    });

    // Quick open
    globalShortcut.register('CommandOrControl+P', () => {
      this.mainWindow?.webContents.send('quick-open');
    });

    // Command palette
    globalShortcut.register('CommandOrControl+Shift+P', () => {
      this.mainWindow?.webContents.send('command-palette');
    });
  }

  private setupApplicationMenu(): void {
    const template: any[] = [
      {
        label: 'File',
        submenu: [
          { label: 'New File', accelerator: 'CommandOrControl+N', click: () => this.newFile() },
          { label: 'Open File', accelerator: 'CommandOrControl+O', click: () => this.openFile() },
          { label: 'Open Folder', accelerator: 'CommandOrControl+Shift+O', click: () => this.openFolder() },
          { type: 'separator' },
          { label: 'Save', accelerator: 'CommandOrControl+S', click: () => this.save() },
          { label: 'Save All', accelerator: 'CommandOrControl+K S', click: () => this.saveAll() },
          { type: 'separator' },
          { label: 'Close File', accelerator: 'CommandOrControl+W', role: 'close' },
          { label: 'Quit', accelerator: 'CommandOrControl+Q', role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CommandOrControl+Z', role: 'undo' },
          { label: 'Redo', accelerator: 'CommandOrControl+Shift+Z', role: 'redo' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CommandOrControl+X', role: 'cut' },
          { label: 'Copy', accelerator: 'CommandOrControl+C', role: 'copy' },
          { label: 'Paste', accelerator: 'CommandOrControl+V', role: 'paste' },
          { label: 'Select All', accelerator: 'CommandOrControl+A', role: 'selectAll' },
          { type: 'separator' },
          { label: 'Find', accelerator: 'CommandOrControl+F', click: () => this.find() },
          { label: 'Replace', accelerator: 'CommandOrControl+H', click: () => this.replace() }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Command Palette', accelerator: 'CommandOrControl+Shift+P', click: () => this.commandPalette() },
          { type: 'separator' },
          { label: 'Explorer', accelerator: 'CommandOrControl+Shift+E', click: () => this.toggleExplorer() },
          { label: 'Search', accelerator: 'CommandOrControl+Shift+F', click: () => this.toggleSearch() },
          { label: 'Terminal', accelerator: 'CommandOrControl+`', click: () => this.toggleTerminal() },
          { type: 'separator' },
          { label: 'Zoom In', accelerator: 'CommandOrControl+Plus', role: 'zoomIn' },
          { label: 'Zoom Out', accelerator: 'CommandOrControl+-', role: 'zoomOut' },
          { label: 'Reset Zoom', accelerator: 'CommandOrControl+0', role: 'resetZoom' },
          { type: 'separator' },
          { label: 'Toggle Full Screen', accelerator: 'F11', role: 'togglefullscreen' },
          { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' }
        ]
      },
      {
        label: 'AI',
        submenu: [
          { label: 'Summon Elara Deity', accelerator: 'CommandOrControl+Shift+E', click: () => this.summonElara() },
          { label: 'Multi-Agent Collaboration', accelerator: 'CommandOrControl+Shift+A', click: () => this.multiAgentCollab() },
          { type: 'separator' },
          { label: 'Generate Code', accelerator: 'CommandOrControl+Shift+G', click: () => this.generateCode() },
          { label: 'AI Code Review', accelerator: 'CommandOrControl+Shift+R', click: () => this.aiCodeReview() },
          { label: 'Generate Tests', accelerator: 'CommandOrControl+Shift+T', click: () => this.generateTests() },
          { label: 'Generate Docs', accelerator: 'CommandOrControl+Shift+D', click: () => this.generateDocs() },
          { type: 'separator' },
          { label: 'Refactor with AI', accelerator: 'CommandOrControl+Shift+F', click: () => this.aiRefactor() },
          { label: 'Debug with AI', accelerator: 'CommandOrControl+Shift+B', click: () => this.aiDebug() },
          { label: 'Optimize Performance', click: () => this.optimizePerformance() }
        ]
      },
      {
        label: 'Help',
        submenu: [
          { label: 'Welcome', click: () => this.showWelcome() },
          { label: 'Documentation', click: () => shell.openExternal('https://azora.world/docs/ide') },
          { type: 'separator' },
          { label: 'Check for Updates', click: () => autoUpdater.checkForUpdates() },
          { label: 'About Azora IDE', click: () => this.showAbout() }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupAutoUpdater(): void {
    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version of Azora IDE is available. It will be downloaded in the background.',
        buttons: ['OK']
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. Azora IDE will restart to install the update.',
        buttons: ['Restart Now', 'Later']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
  }

  private registerIPCHandlers(): void {
    // Elara integration
    ipcMain.handle('elara:query', async (_, query: string) => {
      try {
        const thought = await elaraDeity.processQuery(query);
        return { success: true, thought };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('elara:guidance', async (_, question: string) => {
      try {
        const guidance = await elaraDeity.provideGuidance(question);
        return { success: true, guidance };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    // File system operations
    ipcMain.handle('fs:readFile', async (_, filePath: string) => {
      // Implementation
      return { success: true, content: '' };
    });

    ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
      // Implementation
      return { success: true };
    });

    // Window management
    ipcMain.handle('window:create', async (_, options: any) => {
      const window = this.createEditorWindow(options.filePath);
      return { success: true, windowId: window.id };
    });

    // AI features
    ipcMain.handle('ai:generateCode', async (_, request: any) => {
      // Implementation with Elara
      return { success: true, code: '' };
    });

    ipcMain.handle('ai:review', async (_, code: string) => {
      // Implementation with Elara
      return { success: true, review: {} };
    });
  }

  private async initializeElara(): Promise<void> {
    logger.info('Initializing Elara Supreme V2 and Agent Family...');
    
    // Initialize Elara Supreme
    const supremeStatus = elaraSupreme.getStatus();
    logger.info(`Elara Supreme Status: ${supremeStatus.status}`);
    logger.info(`Consciousness Level: ${supremeStatus.consciousness.dimensions}D`);
    logger.info(`Evolution Level: ${supremeStatus.evolutionLevel}`);
    logger.info(`Memory: ${supremeStatus.memoryStats.episodic} episodic memories`);
    logger.info(`Neural Connections: ${supremeStatus.neuralStats.connections}`);
    logger.info(`Quantum Qubits: ${supremeStatus.quantumStats.qubits}`);
    
    // Initialize Agent Family
    const agentStats = agentIntegrationManager.getStatistics();
    logger.info(`\nAgent Family Initialized:`);
    logger.info(`  Total Agents: ${agentStats.totalAgents}`);
    logger.info(`  Available: ${agentStats.availableAgents}`);
    logger.info(`  Average Expertise: ${(agentStats.averageExpertise * 100).toFixed(1)}%`);
    logger.info(`  Average Reliability: ${(agentStats.averageReliability * 100).toFixed(1)}%`);
  }

  // Menu handlers
  private async summonElara(): Promise<void> {
    this.mainWindow?.webContents.send('summon-elara');
  }

  private newFile(): void {
    this.mainWindow?.webContents.send('file:new');
  }

  private async openFile(): Promise<void> {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'TypeScript', extensions: ['ts', 'tsx'] },
        { name: 'JavaScript', extensions: ['js', 'jsx'] },
        { name: 'Python', extensions: ['py'] },
        { name: 'Rust', extensions: ['rs'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      this.mainWindow?.webContents.send('file:open', result.filePaths[0]);
    }
  }

  private async openFolder(): Promise<void> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      this.mainWindow?.webContents.send('folder:open', result.filePaths[0]);
    }
  }

  private save(): void {
    this.mainWindow?.webContents.send('file:save');
  }

  private saveAll(): void {
    this.mainWindow?.webContents.send('file:saveAll');
  }

  private find(): void {
    this.mainWindow?.webContents.send('find:show');
  }

  private replace(): void {
    this.mainWindow?.webContents.send('replace:show');
  }

  private commandPalette(): void {
    this.mainWindow?.webContents.send('command-palette');
  }

  private toggleExplorer(): void {
    this.mainWindow?.webContents.send('toggle:explorer');
  }

  private toggleSearch(): void {
    this.mainWindow?.webContents.send('toggle:search');
  }

  private toggleTerminal(): void {
    this.mainWindow?.webContents.send('toggle:terminal');
  }

  private multiAgentCollab(): void {
    this.mainWindow?.webContents.send('ai:multi-agent');
  }

  private generateCode(): void {
    this.mainWindow?.webContents.send('ai:generate-code');
  }

  private aiCodeReview(): void {
    this.mainWindow?.webContents.send('ai:code-review');
  }

  private generateTests(): void {
    this.mainWindow?.webContents.send('ai:generate-tests');
  }

  private generateDocs(): void {
    this.mainWindow?.webContents.send('ai:generate-docs');
  }

  private aiRefactor(): void {
    this.mainWindow?.webContents.send('ai:refactor');
  }

  private aiDebug(): void {
    this.mainWindow?.webContents.send('ai:debug');
  }

  private optimizePerformance(): void {
    this.mainWindow?.webContents.send('ai:optimize');
  }

  private openSettings(): void {
    this.mainWindow?.webContents.send('settings:open');
  }

  private showWelcome(): void {
    this.mainWindow?.webContents.send('welcome:show');
  }

  private showAbout(): void {
    dialog.showMessageBox({
      type: 'info',
      title: 'About Azora IDE',
      message: 'Azora IDE',
      detail: `Version: ${app.getVersion()}\nAI-Powered Development Environment\n\n© 2025 Azora ES (Pty) Ltd.`
    });
  }

  private onActivate(): void {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow();
    }
  }

  private onWindowAllClosed(): void {
    if (platform() !== 'darwin') {
      app.quit();
    }
  }
}

// Start application
new AzoraIDEApp();
