# Azora IDE - User Interface

**Revolutionary Voice-Controlled AI Development Platform UI**

---

## 🎨 Design System

### Neural-Inspired Aesthetics
- **Deep space background** - Dark theme optimized for long coding sessions
- **Electric blue & cyan** - Primary and accent colors
- **Glassmorphism effects** - Modern, translucent panels
- **Smooth animations** - Biological, organic feel
- **Glowing accents** - Neural network-inspired visual effects

### Color Palette
```css
Background:  #0a0e1a (Deep space)
Primary:     #3b82f6 (Electric blue)
Accent:      #06b6d4 (Cyan)
Text:        #f8fafc (Pure white)
Muted:       #64748b (Subtle gray)
Success:     #10b981 (Green)
Error:       #ef4444 (Red)
```

---

## 📁 Files

### `index.html` - Main UI Structure
- **Header**: Logo, voice status, continuous dev controls, stats
- **Sidebar**: Navigation (Explorer, Search, Agents, Voice, Continuous, Terminal)
- **Content Area**: Dynamic panels for each feature
- **Editor Container**: Monaco editor with tabs
- **Bottom Panel**: Status bar with agent info
- **Welcome Screen**: First-time user experience

### `styles.css` - Complete Styling
- **1000+ lines** of custom CSS
- Fully responsive layout
- Dark theme optimized
- Neural network effects (glows, pulses, animations)
- Glassmorphism panels
- Smooth transitions
- Custom scrollbars

### `app.js` - Interactive Functionality
- Monaco editor integration
- Voice control (Web Speech API)
- Continuous development simulation
- Multi-agent collaboration
- Keyboard shortcuts
- Welcome screen logic
- Real-time status updates

---

## 🚀 Features

### 1. Voice Control Panel
- **Real-time voice visualization** with animated waves
- **Transcript display** showing what you said
- **Quick command chips** for common tasks
- **Voice status indicator** with glow effect
- **Speech recognition** using Web Speech API

### 2. Continuous Development Panel
- **Cycle statistics** (bugs fixed, tests generated)
- **Real-time activity log** with timestamps
- **Goal progress bars** (test coverage, performance, security)
- **Start/Stop controls** with status indicators
- **Background processing** simulation

### 3. AI Agents Panel
- **Agent cards** with avatars and stats
- **Online status** indicators with pulse animation
- **Expertise ratings** (94.7% average)
- **Role descriptions** for each agent
- **"View All"** button to see complete team

### 4. Monaco Code Editor
- **Syntax highlighting** for 100+ languages
- **IntelliSense** autocomplete
- **Custom Azora theme** with electric blue accents
- **Minimap** navigation
- **Font ligatures** with Fira Code
- **Tab management** for multiple files

### 5. Welcome Screen
- **Beautiful first-launch** experience
- **Feature cards** with animations
- **Quick start** buttons
- **Founder credits** prominently displayed
- **Tutorial access** (coming soon)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+V` | Toggle Voice Control |
| `Ctrl+Shift+C` | Start Continuous Development |
| `Ctrl+Shift+A` | Show AI Agents |
| `Ctrl+Shift+E` | Summon Elara Supreme |
| `Ctrl+N` | New File |
| `Ctrl+S` | Save File |
| `Ctrl+P` | Quick Open |

---

## 🎤 Voice Commands

### Wake Words
- "Hey Azora"
- "Hi Azora"

### Code Generation
- "Create a React component"
- "Generate a login form"
- "Make an API endpoint"

### Code Review & Fixes
- "Fix this bug"
- "Debug this error"
- "Review for security"

### Continuous Development
- "Start continuous development"
- "Enable autonomous mode"

---

## 🎯 UI Components

### Header Bar
- Logo with animated pulse
- Voice status indicator
- Continuous dev button
- Multi-agent button
- Real-time stats (expertise, agents online)
- Founder attribution

### Sidebar Navigation
- Icon-based navigation
- Active state indicators
- Badge notifications (28 agents)
- Smooth hover effects
- Vertical layout

### Content Panels
- Explorer (file tree)
- Search (coming soon)
- AI Agents (28 agent cards)
- Voice (control & transcripts)
- Continuous (stats & logs)
- Terminal (coming soon)

### Editor Area
- Tab management
- Monaco editor
- AI assistant overlay
- Syntax highlighting
- Line numbers
- Minimap

### Status Bar
- Language indicator
- Line/column position
- Encoding
- Agent status
- Elara Supreme indicator

---

## 🎨 Custom Animations

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
Used for: Logo, agent status, voice indicator

### Wave Animation
```css
@keyframes wave {
  0%, 100% { height: 20px; }
  50% { height: 80px; }
}
```
Used for: Voice visualizer

### Glow Animation
```css
@keyframes glow {
  from { box-shadow: 0 0 10px var(--glow-primary); }
  to { box-shadow: 0 0 40px var(--glow-primary); }
}
```
Used for: Active elements, primary buttons

### Slide Up Animation
```css
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```
Used for: AI assistant overlay

---

## 💻 Monaco Editor Integration

### Configuration
```javascript
monaco.editor.create(container, {
  value: '// Your code here',
  language: 'typescript',
  theme: 'azora-dark',
  fontSize: 14,
  fontFamily: 'Fira Code, monospace',
  fontLigatures: true,
  minimap: { enabled: true },
  automaticLayout: true
});
```

### Custom Theme: `azora-dark`
- Electric blue keywords
- Green strings
- Orange numbers
- Italic comments
- Deep space background

---

## 🌟 Unique Features

### 1. Voice Visualization
Real-time animated bars that respond to voice input

### 2. Agent Cards
Beautiful cards showing all 28 AI agents with:
- Avatars with emojis
- Online status pulse
- Expertise percentages
- Role descriptions
- Hover animations

### 3. Continuous Dev Simulation
Live updating stats showing:
- Development cycles
- Bugs fixed
- Tests generated
- Activity log with timestamps

### 4. Glassmorphism Panels
Translucent panels with:
- Backdrop blur
- Subtle borders
- Elevated shadows
- Smooth transitions

### 5. Neural Network Effects
- Glowing borders
- Pulse animations
- Ripple effects
- Gradient accents

---

## 📱 Responsive Design

### Desktop (1920x1080+)
- Full sidebar (64px)
- Content area (300px)
- Editor (flexible)
- All features visible

### Laptop (1366x768)
- Optimized spacing
- Collapsible panels
- Responsive typography

### Tablet/Mobile (Coming Soon)
- Collapsed sidebar
- Swipeable panels
- Touch-optimized controls

---

## 🚀 Performance

### Optimizations
- Hardware-accelerated animations
- Efficient event listeners
- Lazy loading for panels
- Debounced voice processing
- Monaco virtual scrolling

### Load Time
- HTML: <1KB (gzipped)
- CSS: ~15KB (minified)
- JS: ~8KB (minified)
- Monaco: Loaded from CDN
- **Total**: <25KB (excluding Monaco)

---

## 🔧 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary: #3b82f6;    /* Change primary color */
  --accent: #06b6d4;     /* Change accent color */
  --bg-primary: #0a0e1a; /* Change background */
}
```

### Adding New Panels
1. Add nav item in sidebar
2. Create panel HTML in content area
3. Add show/hide logic in `app.js`

### Custom Voice Commands
Add to `processVoiceCommand()` in `app.js`:
```javascript
if (lower.includes('your-command')) {
  // Handle command
  showAIAssistant('Response');
}
```

---

## 🎓 For Developers

### File Structure
```
azora-ide/ui/
├── index.html          # Main UI structure
├── styles.css          # Complete styling
├── app.js              # Interactive functionality
└── README.md           # This file
```

### Dependencies
- **Monaco Editor** (v0.44.0) - Code editor
- **Web Speech API** - Voice recognition (browser built-in)
- **Google Fonts** - Inter & Fira Code fonts

### Browser Support
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Voice control requires Chrome/Edge

---

## 🌍 Accessibility

### Features
- Keyboard navigation
- High contrast text
- Focus indicators
- ARIA labels (coming soon)
- Screen reader support (coming soon)

---

## 📞 Support

Having UI issues? Contact:
- **Technical**: support@azora.world
- **Bugs**: github.com/Azora-OS-AI/azora-os/issues

---

## 👥 Credits

### Design & Development
- **Sizwe Ngwenya** - CEO & Lead Architect
- **Sizwe Motingwe** - Head of Sales
- **Nolundi Ngwenya** - Head of Retail

### Inspiration
- Modern IDEs (VS Code, Cursor)
- Sci-fi interfaces
- Neural network visualizations
- African innovation spirit

---

**Built from Africa, For Humanity 🌍**

**Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.**
