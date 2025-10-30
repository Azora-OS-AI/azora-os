/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV === 'development'

function createWindow(): void {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'default',
    show: false
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Create system tray
  createTray()
}

function createTray(): void {
  const iconPath = path.join(__dirname, '../public/icon.png')
  if (fs.existsSync(iconPath)) {
    tray = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show Azora OS', click: () => mainWindow?.show() },
      { label: 'Hide', click: () => mainWindow?.hide() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ])
    tray.setToolTip('Azora OS')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => mainWindow?.show())
  }
}

// IPC handlers for OS integration
ipcMain.handle('get-system-info', async () => {
  const os = require('os')
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
    hostname: os.hostname(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem()
  }
})

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize()
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('close-window', () => {
  mainWindow?.close()
})

// App event handlers
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    require('electron').shell.openExternal(navigationUrl)
  })
})
