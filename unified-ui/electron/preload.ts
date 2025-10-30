/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // OS Integration APIs
  getAzureServices: () => ipcRenderer.invoke('get-azure-services'),
  getGoogleServices: () => ipcRenderer.invoke('get-google-services'),
  getMicrosoft365Services: () => ipcRenderer.invoke('get-microsoft365-services'),
  getGoogleWorkspaceServices: () => ipcRenderer.invoke('get-google-workspace-services'),

  // File System APIs
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('write-file', path, content),
  listDirectory: (path: string) => ipcRenderer.invoke('list-directory', path),

  // Network APIs
  getNetworkInterfaces: () => ipcRenderer.invoke('get-network-interfaces'),
  ping: (host: string) => ipcRenderer.invoke('ping', host),

  // Security APIs
  encryptData: (data: string) => ipcRenderer.invoke('encrypt-data', data),
  decryptData: (data: string) => ipcRenderer.invoke('decrypt-data', data),
  generateSecurePassword: () => ipcRenderer.invoke('generate-secure-password'),

  // AI/ML APIs
  runPrediction: (model: string, data: any) => ipcRenderer.invoke('run-prediction', model, data),
  trainModel: (data: any) => ipcRenderer.invoke('train-model', data)
})
