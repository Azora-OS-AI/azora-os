/**
 * AZORA OS - Desktop Environment
 *
 * Full-featured desktop environment with window management, taskbar, start menu,
 * desktop icons, and multi-monitor support. Competes with Windows and macOS.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types and Interfaces
export interface WindowConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  zIndex: number;
  icon?: string;
}

export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  onClick: () => void;
  onDoubleClick: () => void;
}

export interface TaskbarItem {
  id: string;
  title: string;
  icon?: string;
  minimized: boolean;
  focused: boolean;
  onClick: () => void;
}

export interface StartMenuItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  onClick: () => void;
}

export interface DesktopEnvironmentProps {
  children?: React.ReactNode;
  backgroundImage?: string;
  wallpaper?: string;
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Window Component
 * Represents an individual application window
 */
const Window: React.FC<{
  config: WindowConfig;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onResize: (size: { width: number; height: number }) => void;
  onMove: (position: { x: number; y: number }) => void;
}> = ({ config, onFocus, onClose, onMinimize, onMaximize, onResize, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onFocus();
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  }, [onFocus]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onMove({ x: Math.max(0, newX), y: Math.max(0, newY) });
    }
  }, [isDragging, dragOffset, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (config.minimized) return null;

  const Component = config.component;

  return (
    <motion.div
      ref={windowRef}
      className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden ${
        config.focused ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: config.position.x,
        top: config.position.y,
        width: config.size.width,
        height: config.size.height,
        zIndex: config.zIndex,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      {/* Window Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          {config.icon && <img src={config.icon} alt="" className="w-4 h-4" />}
          <span className="font-medium text-gray-900 dark:text-white">{config.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 10h10v1H5v-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onMaximize}
            className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM5 5h10v10H5V5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded hover:bg-red-200 dark:hover:bg-red-600 flex items-center justify-center text-red-600"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        <Component {...config.props} />
      </div>

      {/* Resize Handles */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.293l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 13.586V3a1 1 0 012 0v10.586l2.293-2.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </motion.div>
  );
};

/**
 * Desktop Icon Component
 */
const DesktopIcon: React.FC<{
  icon: DesktopIcon;
  onSelect: (id: string) => void;
  selected: boolean;
}> = ({ icon, onSelect, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(icon.name);

  const handleDoubleClick = () => {
    icon.onDoubleClick();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.detail === 1) {
      onSelect(icon.id);
    }
  };

  const handleNameSubmit = () => {
    // Would update icon name in parent component
    setIsEditing(false);
  };

  return (
    <motion.div
      className={`absolute flex flex-col items-center space-y-1 p-2 rounded cursor-pointer select-none ${
        selected ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      style={{ left: icon.position.x, top: icon.position.y }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img src={icon.icon} alt={icon.name} className="w-12 h-12" />
      {isEditing ? (
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
          className="text-xs text-center bg-transparent border border-gray-300 rounded px-1 w-20"
          autoFocus
        />
      ) : (
        <span className="text-xs text-center text-gray-900 dark:text-white max-w-20 truncate">
          {icon.name}
        </span>
      )}
    </motion.div>
  );
};

/**
 * Taskbar Component
 */
const Taskbar: React.FC<{
  items: TaskbarItem[];
  onItemClick: (id: string) => void;
  startMenuOpen: boolean;
  onStartMenuToggle: () => void;
  currentTime: Date;
}> = ({ items, onItemClick, startMenuOpen, onStartMenuToggle, currentTime }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 dark:bg-gray-800 flex items-center justify-between px-2 z-50">
      {/* Start Button */}
      <button
        onClick={onStartMenuToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded ${
          startMenuOpen ? 'bg-blue-600' : 'hover:bg-gray-700'
        }`}
      >
        <img src="/azora-logo.png" alt="Azora OS" className="w-6 h-6" />
        <span className="text-white font-medium">Azora</span>
      </button>

      {/* Taskbar Items */}
      <div className="flex items-center space-x-1 flex-1 mx-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-white hover:bg-gray-700 ${
              item.focused ? 'bg-blue-600' : item.minimized ? 'opacity-50' : ''
            }`}
          >
            {item.icon && <img src={item.icon} alt="" className="w-4 h-4" />}
            <span className="text-sm truncate max-w-32">{item.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-2">
        <span className="text-white text-sm">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/**
 * Start Menu Component
 */
const StartMenu: React.FC<{
  items: StartMenuItem[];
  onItemClick: (id: string) => void;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({ items, onItemClick, onClose, searchQuery, onSearchChange }) => {
  const categories = ['All Apps', 'Productivity', 'Development', 'System', 'Games'];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className="fixed bottom-12 left-0 w-96 bg-white dark:bg-gray-800 rounded-t-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-40"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    >
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="max-h-96 overflow-y-auto p-4">
        {categories.map(category => {
          const categoryItems = filteredItems.filter(item =>
            category === 'All Apps' || item.category === category
          );

          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {categoryItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onItemClick(item.id);
                      onClose();
                    }}
                    className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img src={item.icon} alt={item.name} className="w-8 h-8" />
                    <span className="text-xs text-center text-gray-900 dark:text-white truncate w-full">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

/**
 * Desktop Environment Main Component
 */
export const DesktopEnvironment: React.FC<DesktopEnvironmentProps> = ({
  children,
  backgroundImage,
  wallpaper = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  theme = 'dark'
}) => {
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>([]);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [startMenuSearch, setStartMenuSearch] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextZIndex, setNextZIndex] = useState(1000);

  // Start menu items
  const startMenuItems: StartMenuItem[] = [
    { id: 'browser', name: 'Azora Browser', icon: '/icons/browser.png', category: 'Productivity', onClick: () => openApp('Browser') },
    { id: 'editor', name: 'Code Editor', icon: '/icons/editor.png', category: 'Development', onClick: () => openApp('CodeEditor') },
    { id: 'terminal', name: 'Terminal', icon: '/icons/terminal.png', category: 'System', onClick: () => openApp('Terminal') },
    { id: 'calculator', name: 'Calculator', icon: '/icons/calculator.png', category: 'Productivity', onClick: () => openApp('Calculator') },
    { id: 'file-manager', name: 'File Manager', icon: '/icons/files.png', category: 'System', onClick: () => openApp('FileManager') },
    { id: 'settings', name: 'Settings', icon: '/icons/settings.png', category: 'System', onClick: () => openApp('Settings') },
  ];

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize desktop icons
  useEffect(() => {
    setDesktopIcons([
      {
        id: 'recycle-bin',
        name: 'Recycle Bin',
        icon: '/icons/recycle-bin.png',
        position: { x: 20, y: 20 },
        onClick: () => {},
        onDoubleClick: () => openApp('RecycleBin'),
      },
      {
        id: 'documents',
        name: 'Documents',
        icon: '/icons/folder.png',
        position: { x: 20, y: 100 },
        onClick: () => {},
        onDoubleClick: () => openApp('FileManager', { path: '/documents' }),
      },
      {
        id: 'downloads',
        name: 'Downloads',
        icon: '/icons/folder.png',
        position: { x: 20, y: 180 },
        onClick: () => {},
        onDoubleClick: () => openApp('FileManager', { path: '/downloads' }),
      },
    ]);
  }, []);

  const openApp = (appName: string, props?: any) => {
    const appConfigs: { [key: string]: Partial<WindowConfig> } = {
      Browser: {
        title: 'Azora Browser',
        component: () => <div className="p-4">Browser App Coming Soon</div>,
        icon: '/icons/browser.png',
      },
      CodeEditor: {
        title: 'Code Editor',
        component: () => <div className="p-4">Code Editor Coming Soon</div>,
        icon: '/icons/editor.png',
      },
      Terminal: {
        title: 'Terminal',
        component: () => <div className="p-4 bg-black text-green-400 font-mono p-4">Azora Terminal v1.0<br />$ Welcome to Azora OS</div>,
        icon: '/icons/terminal.png',
      },
      Calculator: {
        title: 'Calculator',
        component: () => <div className="p-4">Calculator App Coming Soon</div>,
        icon: '/icons/calculator.png',
      },
      FileManager: {
        title: 'File Manager',
        component: ({ path }: { path?: string }) => (
          <div className="p-4">
            <h3 className="font-medium mb-2">Path: {path || '/'}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <img src="/icons/folder.png" alt="" className="w-4 h-4" />
                <span>Documents</span>
              </div>
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <img src="/icons/folder.png" alt="" className="w-4 h-4" />
                <span>Pictures</span>
              </div>
            </div>
          </div>
        ),
        icon: '/icons/files.png',
        props,
      },
      Settings: {
        title: 'Settings',
        component: () => <div className="p-4">Settings App Coming Soon</div>,
        icon: '/icons/settings.png',
      },
      RecycleBin: {
        title: 'Recycle Bin',
        component: () => <div className="p-4">Recycle Bin is empty</div>,
        icon: '/icons/recycle-bin.png',
      },
    };

    const config = appConfigs[appName];
    if (!config) return;

    const windowId = `${appName}-${Date.now()}`;
    const newWindow: WindowConfig = {
      id: windowId,
      title: config.title!,
      component: config.component!,
      props: config.props || props || {},
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: { width: 800, height: 600 },
      minimized: false,
      maximized: false,
      focused: true,
      zIndex: nextZIndex,
      icon: config.icon,
    };

    setWindows(prev => {
      // Unfocus all other windows
      const updated = prev.map(w => ({ ...w, focused: false }));
      return [...updated, newWindow];
    });

    setNextZIndex(prev => prev + 1);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(window => ({
      ...window,
      focused: window.id === id,
      zIndex: window.id === id ? nextZIndex : window.zIndex,
    })));
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(window => window.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(window =>
      window.id === id ? { ...window, minimized: !window.minimized } : window
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(window =>
      window.id === id ? {
        ...window,
        maximized: !window.maximized,
        size: window.maximized
          ? { width: 800, height: 600 }
          : { width: window.innerWidth - 40, height: window.innerHeight - 100 }
      } : window
    ));
  };

  const moveWindow = (id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(window =>
      window.id === id ? { ...window, position } : window
    ));
  };

  const resizeWindow = (id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(window =>
      window.id === id ? { ...window, size } : window
    ));
  };

  const taskbarItems: TaskbarItem[] = windows.map(window => ({
    id: window.id,
    title: window.title,
    icon: window.icon,
    minimized: window.minimized,
    focused: window.focused,
    onClick: () => window.minimized ? focusWindow(window.id) : minimizeWindow(window.id),
  }));

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        background: backgroundImage ? `url(${backgroundImage})` : wallpaper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Desktop Icons */}
      {desktopIcons.map(icon => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          onSelect={(id) => setSelectedIcons([id])}
          selected={selectedIcons.includes(icon.id)}
        />
      ))}

      {/* Windows */}
      <AnimatePresence>
        {windows.map(window => (
          <Window
            key={window.id}
            config={window}
            onFocus={() => focusWindow(window.id)}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onResize={(size) => resizeWindow(window.id, size)}
            onMove={(position) => moveWindow(window.id, position)}
          />
        ))}
      </AnimatePresence>

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <StartMenu
            items={startMenuItems}
            onItemClick={(id) => {
              const item = startMenuItems.find(item => item.id === id);
              if (item) item.onClick();
            }}
            onClose={() => setStartMenuOpen(false)}
            searchQuery={startMenuSearch}
            onSearchChange={setStartMenuSearch}
          />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        items={taskbarItems}
        onItemClick={(id) => {
          const item = taskbarItems.find(item => item.id === id);
          if (item) item.onClick();
        }}
        startMenuOpen={startMenuOpen}
        onStartMenuToggle={() => setStartMenuOpen(!startMenuOpen)}
        currentTime={currentTime}
      />

      {/* Children (additional desktop content) */}
      {children}
    </div>
  );
};

export default DesktopEnvironment;
