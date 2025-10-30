
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/ui/sidebar"
import { SystemPulse } from "@/components/ui/system-pulse"
import { ConstitutionalGovernor } from "@/components/ui/constitutional-governor"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GlassmorphicLayout from "@/components/GlassmorphicLayout";
import {
  Brain,
  Crown,
  Shield,
  Coins,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  BookOpen,
  Award,
  Target,
  Zap,
  Users,
  Trophy,
  Eye,
  EyeOff
} from "lucide-react"

// NOTE: The interfaces and dummy data are simplified for this example.
// In a real application, these would be more robust and likely generated from a schema.

export default function AzoraSapiensPage() {
  const [showStats, setShowStats] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [systemHealth, setSystemHealth] = useState(96.4)
  const [activeLearners, setActiveLearners] = useState(2847)
  const [loading, setLoading] = useState(false) // Assuming data is loaded

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.5) * 2)))
      setActiveLearners(prev => Math.max(2800, Math.min(3000, prev + Math.floor((Math.random() - 0.5) * 20))))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const cardClassName = "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl"

  const learningStats = [
    { label: "Knowledge Points", value: "1,2M", change: "+12.5%", icon: Coins, color: "text-purple-400" },
    { label: "Courses Completed", value: "42", change: "+2", icon: BookOpen, color: "text-emerald-400" },
    { label: "Current Level", value: "CKQ-3", change: "68%", icon: Crown, color: "text-blue-400" },
    { label: "Learning Streak", value: `14 days`, change: "+3", icon: Zap, color: "text-teal-400" },
  ];

  const quickActions = [
    { label: "Continue", icon: BookOpen, color: "from-blue-500 to-indigo-500" },
    { label: "Assess", icon: Target, color: "from-emerald-500 to-teal-500" },
    { label: "Rewards", icon: Coins, color: "from-purple-500 to-pink-500" },
    { label: "Community", icon: Users, color: "from-orange-500 to-red-500" },
  ];

  const currentCourses = [
    { title: "Planetary Economic Intelligence", progress: 75, icon: Brain, color: "text-purple-400" },
    { title: "Aegis Integrity Systems", progress: 45, icon: Shield, color: "text-blue-400" },
    { title: "Proof-of-Knowledge Mining", progress: 90, icon: Target, color: "text-emerald-400" },
  ];

  return (
    <GlassmorphicLayout>
      <div className="flex h-screen overflow-hidden text-white font-sans">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-60 relative">
          <div className="border-b border-white/10 bg-black/25 backdrop-blur-lg z-20">
            <SystemPulse />
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Azora Sapiens</h1>
                  <p className="text-md text-gray-400">Planetary Economic Intelligence Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/25 rounded-xl border border-white/10">
                  <div className={`w-3 h-3 rounded-full ${systemHealth > 95 ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                  <span className="text-md font-medium text-gray-300">Aegis: {systemHealth.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-black/25 backdrop-blur-lg border border-white/10 rounded-xl p-1">
                {['Overview', 'Courses', 'Progress', 'Rewards'].map(tab => (
                  <TabsTrigger key={tab} value={tab.toLowerCase()} className="text-gray-300 data-[state=active]:bg-blue-600/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {learningStats.map((stat, i) => (
                    <Card key={i} className={cardClassName}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{stat.change}</Badge>
                        </div>
                        <p className="text-3xl font-bold mt-4">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className={cardClassName}>
                  <CardHeader><CardTitle className="text-xl">Quick Actions</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, i) => (
                      <Button key={i} className={`h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${action.color} rounded-xl shadow-lg hover:scale-105 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                        <span className="font-semibold">{action.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className={cardClassName}>
                  <CardHeader><CardTitle className="text-xl">Current Courses</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {currentCourses.map((course, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <course.icon className={`w-6 h-6 ${course.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-gray-400">{course.progress}%</p>
                          </div>
                          <Progress value={course.progress} className="h-2 mt-1 bg-white/10" indicatorClassName={course.color.replace('text', 'bg')} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other Tabs Content would be similarly styled */}
            </Tabs>
          </main>
        </div>

        <div className="hidden xl:block w-96 border-l border-white/10 bg-black/30 backdrop-blur-xl p-6">
          <ConstitutionalGovernor />
        </div>
      </div>
    </GlassmorphicLayout>
  )
}

export const dynamic = 'force-dynamic';
