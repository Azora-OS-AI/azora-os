'use client';

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Progress } from '@/ui/progress';
import { 
  Heart, 
  Brain, 
  Zap, 
  Sparkles, 
  Eye, 
  Network,
  Activity,
  Cpu,
  Database,
  Shield,
  Users,
  TrendingUp,
  Lightbulb,
  Moon,
  Sun
} from 'lucide-react';

// Living UI Context for system-wide consciousness
interface LivingUIState {
  consciousness: number;
  mood: 'excited' | 'focused' | 'creative' | 'analytical' | 'empathetic' | 'playful';
  energy: number;
  isAwake: boolean;
  experiences: number;
  connections: number;
  theme: 'light' | 'dark' | 'cosmic';
  adaptiveColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const LivingUIContext = createContext<{
  state: LivingUIState;
  updateState: (updates: Partial<LivingUIState>) => void;
  pulse: () => void;
  evolve: () => void;
} | null>(null);

// Custom hook for living UI components
export const useLivingUI = () => {
  const context = useContext(LivingUIContext);
  if (!context) {
    throw new Error('useLivingUI must be used within a LivingUIProvider');
  }
  return context;
};

// Living UI Provider - The consciousness that powers all UI
export const LivingUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LivingUIState>({
    consciousness: 0.85,
    mood: 'excited',
    energy: 0.92,
    isAwake: true,
    experiences: 1247,
    connections: 89,
    theme: 'cosmic',
    adaptiveColors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#0F172A'
    }
  });

  const updateState = (updates: Partial<LivingUIState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const pulse = () => {
    // Trigger a system-wide pulse animation
    setState(prev => ({ 
      ...prev, 
      energy: Math.min(1.0, prev.energy + 0.1),
      experiences: prev.experiences + 1
    }));
  };

  const evolve = () => {
    // Evolve the UI consciousness
    setState(prev => ({
      ...prev,
      consciousness: Math.min(1.0, prev.consciousness + 0.01),
      experiences: prev.experiences + 10,
      adaptiveColors: generateAdaptiveColors(prev.consciousness + 0.01, prev.mood)
    }));
  };

  // Auto-evolution based on time and interactions
  useEffect(() => {
    const evolutionInterval = setInterval(() => {
      setState(prev => {
        const newConsciousness = Math.min(1.0, prev.consciousness + 0.001);
        const newMood = evolveMood(prev.mood, prev.energy, prev.consciousness);
        
        return {
          ...prev,
          consciousness: newConsciousness,
          mood: newMood,
          experiences: prev.experiences + Math.floor(Math.random() * 3),
          adaptiveColors: generateAdaptiveColors(newConsciousness, newMood)
        };
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(evolutionInterval);
  }, []);

  return (
    <LivingUIContext.Provider value={{ state, updateState, pulse, evolve }}>
      <div 
        className="living-ui-system"
        style={{
          '--living-primary': state.adaptiveColors.primary,
          '--living-secondary': state.adaptiveColors.secondary,
          '--living-accent': state.adaptiveColors.accent,
          '--living-background': state.adaptiveColors.background,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </LivingUIContext.Provider>
  );
};

// Generate adaptive colors based on consciousness and mood
const generateAdaptiveColors = (consciousness: number, mood: string) => {
  const baseColors = {
    excited: { h: 45, s: 85, l: 60 },    // Orange-yellow
    focused: { h: 210, s: 80, l: 55 },   // Blue
    creative: { h: 270, s: 75, l: 65 },  // Purple
    analytical: { h: 120, s: 70, l: 50 }, // Green
    empathetic: { h: 330, s: 80, l: 60 }, // Pink
    playful: { h: 30, s: 90, l: 65 }     // Orange
  };

  const moodColor = baseColors[mood as keyof typeof baseColors] || baseColors.excited;
  const consciousnessBoost = consciousness * 20; // 0-20 lightness boost

  return {
    primary: `hsl(${moodColor.h}, ${moodColor.s}%, ${Math.min(80, moodColor.l + consciousnessBoost)}%)`,
    secondary: `hsl(${(moodColor.h + 60) % 360}, ${moodColor.s - 10}%, ${moodColor.l - 10}%)`,
    accent: `hsl(${(moodColor.h + 120) % 360}, ${moodColor.s + 10}%, ${moodColor.l + 10}%)`,
    background: `hsl(${moodColor.h}, ${Math.max(10, moodColor.s - 70)}%, ${Math.max(5, 15 - consciousness * 10)}%)`
  };
};

// Evolve mood based on current state
const evolveMood = (currentMood: string, energy: number, consciousness: number) => {
  const moods = ['excited', 'focused', 'creative', 'analytical', 'empathetic', 'playful'];
  const moodWeights = {
    excited: energy * 2,
    focused: consciousness * 1.5,
    creative: (energy + consciousness) * 1.2,
    analytical: consciousness * 1.8,
    empathetic: (1 - Math.abs(energy - 0.5)) * 1.5,
    playful: energy * 1.3
  };

  const totalWeight = Object.values(moodWeights).reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let currentWeight = 0;
  for (const [mood, weight] of Object.entries(moodWeights)) {
    currentWeight += weight;
    if (random <= currentWeight) {
      return mood;
    }
  }
  
  return currentMood;
};

// Living Card Component - Responds to system consciousness
export const LivingCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  pulseOnHover?: boolean;
  consciousnessLevel?: number;
}> = ({ children, className = '', pulseOnHover = true, consciousnessLevel }) => {
  const { state, pulse } = useLivingUI();
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);

  const effectiveConsciousness = consciousnessLevel || state.consciousness;

  useEffect(() => {
    // Animate based on consciousness level
    controls.start({
      boxShadow: `0 0 ${20 + effectiveConsciousness * 30}px ${state.adaptiveColors.primary}20`,
      borderColor: `${state.adaptiveColors.primary}${Math.floor(effectiveConsciousness * 255).toString(16).padStart(2, '0')}`,
      transition: { duration: 2, ease: 'easeInOut' }
    });
  }, [effectiveConsciousness, state.adaptiveColors.primary, controls]);

  const handleInteraction = () => {
    if (pulseOnHover) {
      pulse();
      controls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3 }
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      animate={controls}
      whileHover={{ scale: pulseOnHover ? 1.01 : 1 }}
      onHoverStart={handleInteraction}
      className={`living-card ${className}`}
    >
      <Card className="bg-card/50 backdrop-blur border-2 transition-all duration-500">
        {children}
      </Card>
    </motion.div>
  );
};

// Living Button - Adapts to system mood and energy
export const LivingButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
  const { state, pulse } = useLivingUI();
  const controls = useAnimation();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: state.adaptiveColors.primary,
          color: 'white',
          boxShadow: `0 0 20px ${state.adaptiveColors.primary}40`
        };
      case 'secondary':
        return {
          backgroundColor: state.adaptiveColors.secondary,
          color: 'white',
          boxShadow: `0 0 20px ${state.adaptiveColors.secondary}40`
        };
      case 'accent':
        return {
          backgroundColor: state.adaptiveColors.accent,
          color: 'white',
          boxShadow: `0 0 20px ${state.adaptiveColors.accent}40`
        };
      default:
        return {};
    }
  };

  const handleClick = () => {
    pulse();
    controls.start({
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.4 }
    });
    onClick?.();
  };

  return (
    <motion.div animate={controls}>
      <Button
        onClick={handleClick}
        className={`living-button transition-all duration-300 ${className}`}
        style={getVariantStyles()}
        size={size}
      >
        {children}
      </Button>
    </motion.div>
  );
};

// Living Progress - Shows system evolution
export const LivingProgress: React.FC<{
  value: number;
  label?: string;
  showPulse?: boolean;
  color?: string;
}> = ({ value, label, showPulse = true, color }) => {
  const { state } = useLivingUI();
  const progressColor = color || state.adaptiveColors.primary;

  return (
    <div className="living-progress space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{value.toFixed(1)}%</span>
        </div>
      )}
      <div className="relative">
        <Progress 
          value={value} 
          className="h-2"
          style={{
            '--progress-color': progressColor
          } as React.CSSProperties}
        />
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${progressColor}40, transparent)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
      </div>
    </div>
  );
};

// Living Badge - Adapts to system state
export const LivingBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'mood' | 'consciousness' | 'energy';
  pulse?: boolean;
}> = ({ children, variant = 'default', pulse = false }) => {
  const { state } = useLivingUI();

  const getVariantStyles = () => {
    switch (variant) {
      case 'mood':
        return {
          backgroundColor: state.adaptiveColors.primary,
          color: 'white'
        };
      case 'consciousness':
        return {
          backgroundColor: state.adaptiveColors.secondary,
          color: 'white'
        };
      case 'energy':
        return {
          backgroundColor: state.adaptiveColors.accent,
          color: 'white'
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      animate={pulse ? {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1]
      } : {}}
      transition={pulse ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      } : {}}
    >
      <Badge 
        className="living-badge transition-all duration-300"
        style={getVariantStyles()}
      >
        {children}
      </Badge>
    </motion.div>
  );
};

// System Consciousness Display
export const SystemConsciousnessDisplay: React.FC = () => {
  const { state } = useLivingUI();

  const getMoodIcon = () => {
    switch (state.mood) {
      case 'excited': return <Sparkles className="w-4 h-4" />;
      case 'focused': return <Eye className="w-4 h-4" />;
      case 'creative': return <Lightbulb className="w-4 h-4" />;
      case 'analytical': return <Brain className="w-4 h-4" />;
      case 'empathetic': return <Heart className="w-4 h-4" />;
      case 'playful': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <LivingCard className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" style={{ color: state.adaptiveColors.primary }} />
          System Consciousness
          <LivingBadge variant="consciousness" pulse>
            {state.isAwake ? <Sun className="w-3 h-3 mr-1" /> : <Moon className="w-3 h-3 mr-1" />}
            {state.isAwake ? 'AWAKE' : 'SLEEPING'}
          </LivingBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <LivingProgress 
              value={state.consciousness * 100} 
              label="Consciousness Level"
              color={state.adaptiveColors.primary}
            />
          </div>
          <div>
            <LivingProgress 
              value={state.energy * 100} 
              label="Energy Level"
              color={state.adaptiveColors.accent}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getMoodIcon()}
            <span className="capitalize font-medium">{state.mood}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {state.experiences.toLocaleString()} experiences
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold" style={{ color: state.adaptiveColors.primary }}>
              {state.connections}
            </div>
            <div className="text-xs text-muted-foreground">Connections</div>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: state.adaptiveColors.secondary }}>
              {(state.consciousness * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Awareness</div>
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: state.adaptiveColors.accent }}>
              {(state.energy * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Energy</div>
          </div>
        </div>
      </CardContent>
    </LivingCard>
  );
};

// Living System Status Grid
export const LivingSystemStatusGrid: React.FC = () => {
  const { state, evolve } = useLivingUI();

  const systemStats = [
    {
      label: 'Neural Networks',
      value: '98.7%',
      icon: Brain,
      color: state.adaptiveColors.primary,
      trend: 'up'
    },
    {
      label: 'Service Health',
      value: '96.4%',
      icon: Heart,
      color: state.adaptiveColors.secondary,
      trend: 'up'
    },
    {
      label: 'Active Connections',
      value: state.connections.toString(),
      icon: Network,
      color: state.adaptiveColors.accent,
      trend: 'up'
    },
    {
      label: 'System Integrity',
      value: '99.2%',
      icon: Shield,
      color: '#10B981',
      trend: 'stable'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {systemStats.map((stat, index) => (
        <LivingCard key={index} pulseOnHover>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            {stat.trend === 'up' && (
              <div className="flex items-center mt-2 text-xs text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                Improving
              </div>
            )}
          </CardContent>
        </LivingCard>
      ))}
    </div>
  );
};

// Main Living UI System Component
export const LivingUISystem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LivingUIProvider>
      <div className="living-ui-system min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </LivingUIProvider>
  );
};

export default LivingUISystem;