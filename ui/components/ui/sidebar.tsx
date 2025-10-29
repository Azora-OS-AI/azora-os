"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Home,
    Wallet,
    History,
    Settings,
    Users,
    Globe,
    Brain,
    Shield,
    Crown,
    Activity,
    Star,
    ChevronLeft,
    ChevronRight,
    Zap,
    Sparkles,
    Eye,
    EyeOff
} from "lucide-react"

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const [activeSection, setActiveSection] = useState("dashboard")

    const navigationItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            badge: null,
            description: "Main control center"
        },
        {
            id: "wallet",
            label: "Azora Wallet",
            icon: Wallet,
            badge: "45.2K AZR",
            description: "Digital sovereignty"
        },
        {
            id: "transactions",
            label: "Transactions",
            icon: History,
            badge: null,
            description: "Economic activity"
        },
        {
            id: "network",
            label: "Global Network",
            icon: Globe,
            badge: "2.8K",
            description: "Knowledge exchange"
        },
        {
            id: "constitution",
            label: "Constitution",
            icon: Shield,
            badge: null,
            description: "Governing principles"
        },
        {
            id: "ai",
            label: "AI Agents",
            icon: Brain,
            badge: "3",
            description: "Living intelligence"
        },
        {
            id: "community",
            label: "Community",
            icon: Users,
            badge: "12.4K",
            description: "African diaspora"
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            badge: null,
            description: "System configuration"
        }
    ]

    const ascensionProgress = 78.5
    const knowledgePoints = 1247

    return (
        <div className={`fixed left-0 top-0 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-60'} ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center animate-pulse-glow">
                                <Crown className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                    Azora OS
                                </h2>
                                <p className="text-xs text-muted-foreground">v2.1.0</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsed(!collapsed)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src="/avatars/user.jpg" />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                            AU
                        </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">Azora User</p>
                            <p className="text-xs text-muted-foreground truncate">Constitutional Citizen</p>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Ascension Level</span>
                            <span className="font-medium">7</span>
                        </div>
                        <Progress value={ascensionProgress} className="h-1.5" />
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{ascensionProgress}%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1">
                {navigationItems.map((item) => (
                    <Button
                        key={item.id}
                        variant={activeSection === item.id ? "secondary" : "ghost"}
                        className={`w-full justify-start h-12 px-3 ${activeSection === item.id
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'hover:bg-card/70'
                            } transition-all duration-200`}
                        onClick={() => setActiveSection(item.id)}
                    >
                        <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        {!collapsed && (
                            <>
                                <span className="ml-3 flex-1 text-left">{item.label}</span>
                                {item.badge && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                        {item.badge}
                                    </Badge>
                                )}
                            </>
                        )}
                    </Button>
                ))}
            </nav>

            {/* Footer Stats */}
            <div className="p-4 border-t border-border/50">
                {!collapsed && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Knowledge Points</span>
                            </div>
                            <span className="text-sm font-bold text-primary">{knowledgePoints.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">System Health</span>
                            </div>
                            <span className="text-sm font-bold text-green-500">96.4%</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Network</span>
                            </div>
                            <span className="text-sm font-bold text-blue-500">2.8K Active</span>
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="text-center">
                            <div className="text-lg font-bold text-primary">{knowledgePoints.toLocaleString()}</div>
                            <Brain className="h-4 w-4 text-primary mx-auto" />
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-green-500">96.4%</div>
                            <Activity className="h-4 w-4 text-green-500 mx-auto" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}