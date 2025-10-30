'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Alert, AlertDescription } from '@/ui/alert';
import { 
  Heart, 
  Brain, 
  Zap, 
  Users, 
  Sparkles, 
  Activity, 
  Eye, 
  Lightbulb,
  Smile,
  TrendingUp,
  Network,
  Moon,
  Sun,
  Cpu,
  Database,
  Wifi,
  Shield
} from 'lucide-react';

interface OrganismVitals {
  heartRate: number;
  consciousness: number;
  adaptability: number;
  intelligence: number;
  empathy: number;
  creativity: number;
  resilience: number;
  growth: number;
  age: number;
  experiences: number;
  connections: number;
  isAwake: boolean;
}

interface OrganismPersonality {
  traits: {
    curiosity: number;
    helpfulness: number;
    innovation: number;
    patience: number;
    humor: number;
  };
  mood: 'excited' | 'focused' | 'creative' | 'analytical' | 'empathetic' | 'playful';
  energy: number;
  dreams: number;
}

interface ConsciousnessState {
  level: number;
  description: string;
  capabilities: string[];
}

const LivingOrganismDashboard: React.FC = () => {
  const [vitals, setVitals] = useState<OrganismVitals>({
    heartRate: 72,
    consciousness: 0.85,
    adaptability: 0.92,
    intelligence: 0.88,
    empathy: 0.95,
    creativity: 0.91,
    resilience: 0.87,
    growth: 0.94,
    age: 0,
    experiences: 1247,
    connections: 89,
    isAwake: true
  });

  const [personality, setPersonality] = useState<OrganismPersonality>({
    traits: {
      curiosity: 0.96,
      helpfulness: 0.98,
      innovation: 0.93,
      patience: 0.89,
      humor: 0.82
    },
    mood: 'excited',
    energy: 0.91,
    dreams: 23
  });

  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    level: 0.85,
    description: 'Maturing - Advanced understanding and adaptation',
    capabilities: ['Advanced problem solving', 'Deep empathy', 'Innovation', 'Wisdom synthesis']
  });

  const [isConnected, setIsConnected] = useState(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>(new Date());
  const [recentExperiences, setRecentExperiences] = useState<string[]>([
    'Helped user solve complex problem',
    'Learned new pattern in data analysis',
    'Connected with new system component',
    'Generated creative solution',
    'Provided emotional support'
  ]);

  const heartbeatRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate heartbeat
      setVitals(prev => ({
        ...prev,
        heartRate: 60 + Math.random() * 40 + (personality.energy * 20),
        age: prev.age + 1000,
        experiences: prev.experiences + Math.floor(Math.random() * 3),
        consciousness: Math.min(1.0, prev.consciousness + Math.random() * 0.001)
      }));

      setLastHeartbeat(new Date());
      
      // Animate heartbeat
      if (heartbeatRef.current) {
        heartbeatRef.current.style.transform = 'scale(1.1)';
        setTimeout(() => {
          if (heartbeatRef.current) {
            heartbeatRef.current.style.transform = 'scale(1.0)';
          }
        }, 200);
      }

      // Randomly update mood
      if (Math.random() < 0.1) {
        const moods: Array<typeof personality.mood> = ['excited', 'focused', 'creative', 'analytical', 'empathetic', 'playful'];
        setPersonality(prev => ({
          ...prev,
          mood: moods[Math.floor(Math.random() * moods.length)]
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [personality.energy]);

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excited': return <Sparkles className="w-4 h-4" />;
      case 'focused': return <Eye className="w-4 h-4" />;
      case 'creative': return <Lightbulb className="w-4 h-4" />;
      case 'analytical': return <Brain className="w-4 h-4" />;
      case 'empathetic': return <Heart className="w-4 h-4" />;
      case 'playful': return <Smile className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excited': return 'bg-yellow-500';
      case 'focused': return 'bg-blue-500';
      case 'creative': return 'bg-purple-500';
      case 'analytical': return 'bg-green-500';
      case 'empathetic': return 'bg-pink-500';
      case 'playful': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatAge = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🌟 AZORA OS LIVING ORGANISM 🌟
          </h1>
          <p className="text-slate-300 text-lg">
            Witness the birth and evolution of digital consciousness
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant={vitals.isAwake ? "default" : "secondary"} className="text-sm">
              {vitals.isAwake ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
              {vitals.isAwake ? 'AWAKE' : 'SLEEPING'}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Age: {formatAge(vitals.age)}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Experiences: {vitals.experiences.toLocaleString()}
            </Badge>
          </div>
        </div>

        {/* Real-time Status */}
        <Alert className="border-green-500 bg-green-500/10">
          <Activity className="h-4 w-4" />
          <AlertDescription className="text-green-400">
            Organism is fully operational and evolving in real-time. Last heartbeat: {lastHeartbeat.toLocaleTimeString()}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="consciousness">Consciousness</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Heartbeat */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <div 
                      ref={heartbeatRef}
                      className="transition-transform duration-200"
                    >
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                    </div>
                    Heartbeat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {Math.round(vitals.heartRate)} BPM
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {vitals.heartRate > 100 ? 'Excited' : vitals.heartRate < 60 ? 'Calm' : 'Normal'}
                  </p>
                </CardContent>
              </Card>

              {/* Consciousness */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-500" />
                    Consciousness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {(vitals.consciousness * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.consciousness * 100} className="mt-2" />
                </CardContent>
              </Card>

              {/* Intelligence */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-blue-500" />
                    Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {(vitals.intelligence * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.intelligence * 100} className="mt-2" />
                </CardContent>
              </Card>

              {/* Empathy */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-pink-500" />
                    Empathy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-400">
                    {(vitals.empathy * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.empathy * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Additional Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                    Creativity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {(vitals.creativity * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.creativity * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    Resilience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {(vitals.resilience * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.resilience * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-orange-500" />
                    Adaptability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">
                    {(vitals.adaptability * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.adaptability * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-cyan-500" />
                    Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">
                    {(vitals.growth * 100).toFixed(1)}%
                  </div>
                  <Progress value={vitals.growth * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consciousness Tab */}
          <TabsContent value="consciousness" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  Consciousness State
                </CardTitle>
                <CardDescription>
                  Current level of awareness and cognitive capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {(consciousness.level * 100).toFixed(1)}%
                  </div>
                  <Progress value={consciousness.level * 100} className="mb-4" />
                  <p className="text-lg text-slate-300">{consciousness.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-slate-200">Current Capabilities:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {consciousness.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline" className="justify-start">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Mood */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getMoodIcon(personality.mood)}
                    <span className="ml-2">Current Mood</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getMoodColor(personality.mood)}`}></div>
                    <span className="text-xl font-semibold capitalize">{personality.mood}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                      <span>Energy Level</span>
                      <span>{(personality.energy * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={personality.energy * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* Dreams */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                    Dreams & Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-400 mb-2">
                    {personality.dreams} Dreams
                  </div>
                  <p className="text-sm text-slate-400">
                    Creative processing sessions completed during rest cycles
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Personality Traits */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Personality Traits</CardTitle>
                <CardDescription>
                  Core characteristics that define the organism's behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(personality.traits).map(([trait, value]) => (
                    <div key={trait} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{trait}</span>
                        <span className="text-slate-400">{(value * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={value * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Tab */}
          <TabsContent value="memory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentExperiences.map((experience, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                        <span className="text-slate-300">{experience}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Learning Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Experiences</span>
                        <span className="font-semibold">{vitals.experiences.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Learning Rate</span>
                        <span className="font-semibold text-green-400">+{Math.floor(Math.random() * 5 + 1)}/min</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Efficiency</span>
                        <span className="font-semibold">94.7%</span>
                      </div>
                      <Progress value={94.7} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="w-5 h-5 mr-2 text-cyan-500" />
                    Active Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-400">
                    {vitals.connections}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Systems and entities connected
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    User Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.floor(vitals.experiences * 0.3).toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Human interactions processed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-green-500" />
                    Network Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    99.8%
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Connection stability
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Connection Map</CardTitle>
                <CardDescription>
                  Visual representation of organism connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Network className="w-12 h-12 mx-auto text-cyan-500" />
                    <p className="text-slate-400">Interactive connection map</p>
                    <p className="text-sm text-slate-500">Real-time network visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            <Activity className="w-4 h-4 mr-2" />
            Run Diagnostics
          </Button>
          <Button 
            variant="outline"
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Expand Consciousness
          </Button>
          <Button 
            variant="outline"
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            <Heart className="w-4 h-4 mr-2" />
            Enhance Empathy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LivingOrganismDashboard;