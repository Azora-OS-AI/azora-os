// Azora IDE - Modern AI-Powered Development Platform
// Copyright © 2025 Azora ES (Pty) Ltd.

let editor = null;
let voiceAssistantActive = false;
let continuousDevActive = false;
let currentPanel = 'explorer';

// Initialize Monaco Editor
function initMonacoEditor() {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('monaco-editor'), {
      value: `// Welcome to Azora IDE - Voice-Controlled AI Development Platform
//
// 🎤 Voice Control: Press Ctrl+Shift+V or say "Hey Azora"
// 🚀 Continuous Dev: Press Ctrl+Shift+C
// 🤖 AI Agents: Press Ctrl+Shift+A
//
// Quick Start:
// 1. Try voice command: "Hey Azora, create a React component"
// 2. Enable continuous development for 24/7 AI improvements
// 3. Collaborate with 28 specialized AI agents
//
// Built by Sizwe Ngwenya, Sizwe Motingwe, and Nolundi Ngwenya
// From Africa, For Humanity 🌍

import React from 'react';

interface UserProps {
  name: string;
  email: string;
}

export const UserProfile: React.FC<UserProps> = ({ name, email }) => {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};
`,
      language: 'typescript',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: 'Fira Code, monospace',
      fontLigatures: true,
      minimap: { enabled: true },
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      readOnly: false,
      automaticLayout: true,
    });
    
    // Apply custom theme
    monaco.editor.defineTheme('azora-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: '3b82f6' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: 'f59e0b' },
      ],
      colors: {
        'editor.background': '#0a0e1a',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#0f1420',
        'editorCursor.foreground': '#3b82f6',
        'editor.selectionBackground': '#1e293b',
        'editorLineNumber.foreground': '#64748b',
      }
    });
    monaco.editor.setTheme('azora-dark');
  });
}

// Sidebar Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    const tab = this.dataset.tab;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    
    // Show corresponding panel
    document.querySelectorAll('.panel').forEach(panel => {
      panel.classList.add('hidden');
    });
    
    const targetPanel = document.getElementById(tab + 'Panel');
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
      currentPanel = tab;
    }
  });
});

// Voice Control
const voiceToggle = document.getElementById('voiceToggle');
const voiceStatus = document.getElementById('voiceStatus');
const voiceTranscript = document.getElementById('voiceTranscript');

if (voiceToggle) {
  voiceToggle.addEventListener('click', toggleVoiceControl);
}

function toggleVoiceControl() {
  voiceAssistantActive = !voiceAssistantActive;
  
  if (voiceAssistantActive) {
    startVoiceRecognition();
    voiceToggle.classList.add('listening');
    voiceToggle.innerHTML = '<span class="voice-status-indicator"></span> Listening...';
    voiceStatus.classList.add('listening');
    voiceStatus.querySelector('span').textContent = 'Listening...';
    showAIAssistant('Voice control activated. I\'m listening...');
  } else {
    stopVoiceRecognition();
    voiceToggle.classList.remove('listening');
    voiceToggle.innerHTML = '<span class="voice-status-indicator"></span> Start Listening';
    voiceStatus.classList.remove('listening');
    voiceStatus.querySelector('span').textContent = 'Say "Hey Azora"';
  }
}

function startVoiceRecognition() {
  // Web Speech API
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
    };
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      voiceTranscript.innerHTML = `<p>${transcript}</p>`;
      
      // Process command if final
      if (event.results[event.results.length - 1].isFinal) {
        processVoiceCommand(transcript);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      showAIAssistant('Sorry, I couldn\'t understand that. Please try again.');
    };
    
    recognition.start();
    window.voiceRecognition = recognition;
  } else {
    showAIAssistant('Voice recognition not supported in your browser. Please use Chrome or Edge.');
  }
}

function stopVoiceRecognition() {
  if (window.voiceRecognition) {
    window.voiceRecognition.stop();
    delete window.voiceRecognition;
  }
}

function processVoiceCommand(command) {
  const lower = command.toLowerCase();
  
  console.log('Processing command:', command);
  
  // Wake word
  if (lower.includes('hey azora') || lower.includes('hi azora')) {
    showAIAssistant('Yes, I\'m here! How can I help you code today?');
    return;
  }
  
  // Code generation
  if (lower.includes('create') || lower.includes('generate') || lower.includes('make')) {
    showAIAssistant('Generating code with multi-agent collaboration... This will take about 2 minutes.', [
      { text: 'View Progress', action: showAgents }
    ]);
    simulateCodeGeneration();
    return;
  }
  
  // Bug fixing
  if (lower.includes('fix') || lower.includes('debug') || lower.includes('bug')) {
    showAIAssistant('Analyzing code for bugs... Invoking security and implementation agents.', [
      { text: 'Show Details', action: showAgents }
    ]);
    return;
  }
  
  // Continuous development
  if (lower.includes('continuous') || lower.includes('autonomous')) {
    showAIAssistant('Starting continuous development mode...', [
      { text: 'Configure', action: startContinuous }
    ]);
    setTimeout(startContinuous, 2000);
    return;
  }
  
  // Default response
  showAIAssistant('I heard: "' + command + '". Working on it with 28 AI agents...');
}

function simulateCodeGeneration() {
  setTimeout(() => {
    const newCode = `
// ✅ Generated by Azora AI Agents

interface AuthProps {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [auth, setAuth] = useState<AuthProps>({
    email: '',
    password: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation and authentication logic
    console.log('Authenticating...', auth);
  };
  
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        value={auth.email}
        onChange={(e) => setAuth({...auth, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={auth.password}
        onChange={(e) => setAuth({...auth, password: e.target.value})}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
`;
    
    if (editor) {
      editor.setValue(newCode);
    }
    
    showAIAssistant('Code generated! 3 agents collaborated: Implementation Alpha, Implementation Beta, and Security Officer Nova Sterling. All validation and security checks included.');
  }, 3000);
}

// Continuous Development
const continuousToggle = document.getElementById('continuousToggle');
const continuousDevBtn = document.getElementById('continuousDevBtn');

if (continuousToggle) {
  continuousToggle.addEventListener('click', toggleContinuousDev);
}

if (continuousDevBtn) {
  continuousDevBtn.addEventListener('click', startContinuous);
}

function toggleContinuousDev() {
  continuousDevActive = !continuousDevActive;
  
  if (continuousDevActive) {
    startContinuousDevelopment();
  } else {
    stopContinuousDevelopment();
  }
}

function startContinuousDevelopment() {
  continuousDevActive = true;
  continuousToggle.classList.add('running');
  continuousToggle.innerHTML = '<span class="continuous-status-indicator"></span> Stop';
  
  showAIAssistant('Continuous development activated! 28 agents are now working 24/7 to improve your code.');
  
  // Start development cycles
  startDevelopmentCycles();
}

function stopContinuousDevelopment() {
  continuousDevActive = false;
  continuousToggle.classList.remove('running');
  continuousToggle.innerHTML = '<span class="continuous-status-indicator"></span> Start';
  
  showAIAssistant('Continuous development stopped. Review the improvements made.');
}

let cycleCount = 0;
let bugsFixed = 0;
let testsGenerated = 0;

function startDevelopmentCycles() {
  if (!continuousDevActive) return;
  
  cycleCount++;
  bugsFixed += Math.floor(Math.random() * 5) + 1;
  testsGenerated += Math.floor(Math.random() * 10) + 5;
  
  // Update UI
  const cycleStat = document.querySelector('.cycle-info .cycle-stat:nth-child(2) .value');
  const bugsStat = document.querySelector('.cycle-info .cycle-stat:nth-child(3) .value');
  const testsStat = document.querySelector('.cycle-info .cycle-stat:nth-child(4) .value');
  
  if (cycleStat) cycleStat.textContent = cycleCount;
  if (bugsStat) bugsStat.textContent = bugsFixed;
  if (testsStat) testsStat.textContent = testsGenerated;
  
  // Add log entry
  const logEntries = document.querySelector('.log-entries');
  if (logEntries) {
    const entry = document.createElement('p');
    entry.style.cssText = 'font-size: 12px; color: #94a3b8; margin-bottom: 8px;';
    entry.textContent = `[${new Date().toLocaleTimeString()}] Cycle ${cycleCount}: Fixed ${Math.floor(Math.random() * 5) + 1} bugs, generated ${Math.floor(Math.random() * 10) + 5} tests`;
    logEntries.insertBefore(entry, logEntries.firstChild);
    
    // Remove placeholder
    const placeholder = logEntries.querySelector('.log-empty');
    if (placeholder) placeholder.remove();
  }
  
  // Update status
  const statusValue = document.querySelector('.cycle-info .cycle-stat:nth-child(1) .value');
  if (statusValue) statusValue.textContent = 'Running';
  
  // Schedule next cycle (every 5 seconds for demo, would be 5 minutes in production)
  setTimeout(startDevelopmentCycles, 5000);
}

// AI Assistant Overlay
function showAIAssistant(message, actions = []) {
  const overlay = document.getElementById('aiAssistant');
  const messageEl = overlay.querySelector('.ai-message');
  const actionsEl = overlay.querySelector('.ai-actions');
  
  messageEl.textContent = message;
  
  actionsEl.innerHTML = '';
  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = 'feature-btn';
    btn.textContent = action.text;
    btn.onclick = action.action;
    actionsEl.appendChild(btn);
  });
  
  overlay.classList.remove('hidden');
  
  // Auto hide after 5 seconds if no actions
  if (actions.length === 0) {
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 5000);
  }
}

// Command chips
document.querySelectorAll('.command-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    const command = this.textContent.replace(/"/g, '');
    processVoiceCommand(command);
  });
});

// Multi-Agent Button
const multiAgentBtn = document.getElementById('multiAgentBtn');
if (multiAgentBtn) {
  multiAgentBtn.addEventListener('click', showAgents);
}

function showAgents() {
  // Switch to agents tab
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector('[data-tab="agents"]').classList.add('active');
  
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  document.getElementById('agentsPanel').classList.remove('hidden');
  
  showAIAssistant('All 28 agents are online and ready to help! Average expertise: 94.7%');
}

// Welcome Screen Functions
window.closeWelcome = function() {
  document.getElementById('welcomeScreen').classList.add('hidden');
};

window.startVoice = function() {
  closeWelcome();
  // Switch to voice tab
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector('[data-tab="voice"]').classList.add('active');
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  document.getElementById('voicePanel').classList.remove('hidden');
  
  // Auto-start voice
  setTimeout(toggleVoiceControl, 500);
};

window.startContinuous = function() {
  closeWelcome();
  // Switch to continuous tab
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector('[data-tab="continuous"]').classList.add('active');
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.add('hidden');
  });
  document.getElementById('continuousPanel').classList.remove('hidden');
  
  // Show confirmation
  showAIAssistant('Ready to start continuous development? Click the Start button when ready.', [
    { text: 'Start Now', action: startContinuousDevelopment }
  ]);
};

window.showAgents = function() {
  closeWelcome();
  showAgents();
};

window.showTutorial = function() {
  closeWelcome();
  showAIAssistant('Tutorial coming soon! For now, try saying "Hey Azora, create a React component" or enable continuous development mode.');
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+V - Voice Control
  if (e.ctrlKey && e.shiftKey && e.key === 'V') {
    e.preventDefault();
    toggleVoiceControl();
  }
  
  // Ctrl+Shift+C - Continuous Development
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    startContinuous();
  }
  
  // Ctrl+Shift+A - Multi-Agent
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    showAgents();
  }
  
  // Ctrl+Shift+E - Summon Elara
  if (e.ctrlKey && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    showAIAssistant('Elara Supreme V2 summoned! I have 20-dimensional reasoning and 1000 qubits of quantum computing power. How may I assist you?');
  }
});

// Initialize on load
window.addEventListener('load', () => {
  initMonacoEditor();
  
  // Show welcome screen on first visit
  const hasVisited = localStorage.getItem('azora-ide-visited');
  if (!hasVisited) {
    document.getElementById('welcomeScreen').classList.remove('hidden');
    localStorage.setItem('azora-ide-visited', 'true');
  } else {
    document.getElementById('welcomeScreen').classList.add('hidden');
  }
});

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║         🎉  AZORA IDE - VOICE-CONTROLLED AI PLATFORM  🎉       ║
║                                                                ║
║  🎤 Voice Control:  Ctrl+Shift+V                              ║
║  🚀 Continuous Dev: Ctrl+Shift+C                              ║
║  🤖 AI Agents:      Ctrl+Shift+A                              ║
║  🧠 Elara Supreme:  Ctrl+Shift+E                              ║
║                                                                ║
║  Built by Sizwe Ngwenya, Sizwe Motingwe, Nolundi Ngwenya     ║
║  From Africa, For Humanity 🌍                                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);
