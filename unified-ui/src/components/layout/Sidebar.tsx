/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Building,
  Cloud,
  Code,
  Cpu,
  Database,
  GraduationCap,
  Home,
  Layers,
  Map,
  Shield,
  ShoppingCart,
  Users,
  Zap,
  Settings,
  Globe,
  Network,
  HardDrive,
  Lock,
  Wrench,
  FileText,
  Eye,
  Bell,
  Coins,
  Castle,
  Hammer,
  NetworkIcon,
  ScrollText,
  Brain
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Academy',
    href: '/academy',
    icon: GraduationCap,
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: ShoppingCart,
  },
]

const services = [
  {
    name: 'Enterprise',
    href: '/enterprise',
    icon: Building,
  },
  {
    name: 'Compliance',
    href: '/compliance',
    icon: Shield,
  },
  {
    name: 'Cloud Services',
    href: '/cloud',
    icon: Cloud,
  },
  {
    name: 'Development',
    href: '/development',
    icon: Code,
  },
  {
    name: 'Learning',
    href: '/learning',
    icon: BookOpen,
  },
]

const azoraModules = [
  {
    name: 'Atlas',
    href: '/atlas',
    icon: Map,
    description: 'Global Intelligence'
  },
  {
    name: 'Council',
    href: '/council',
    icon: Users,
    description: 'Governance System'
  },
  {
    name: 'Pulse',
    href: '/pulse',
    icon: Zap,
    description: 'Real-time Monitoring'
  },
  {
    name: 'Signal',
    href: '/signal',
    icon: Bell,
    description: 'Communication Hub'
  },
  {
    name: 'Vault',
    href: '/vault',
    icon: Database,
    description: 'Secure Storage'
  },
  {
    name: 'Vigil',
    href: '/vigil',
    icon: Eye,
    description: 'Surveillance System'
  },
  {
    name: 'Mint',
    href: '/mint',
    icon: Coins,
    description: 'Token Management'
  },
  {
    name: 'Aegis',
    href: '/aegis',
    icon: Castle,
    description: 'Security Framework'
  },
  {
    name: 'Forge',
    href: '/forge',
    icon: Hammer,
    description: 'Development Tools'
  },
  {
    name: 'Nexus',
    href: '/nexus',
    icon: NetworkIcon,
    description: 'Service Integration'
  },
  {
    name: 'Scriptorium',
    href: '/scriptorium',
    icon: ScrollText,
    description: 'Knowledge Base'
  },
  {
    name: 'Synapse',
    href: '/synapse',
    icon: Brain,
    description: 'AI Orchestrator'
  },
]

const osComponents = [
  {
    name: 'Desktop Environment',
    href: '/desktop',
    icon: Cpu,
  },
  {
    name: 'File System',
    href: '/filesystem',
    icon: HardDrive,
  },
  {
    name: 'Process Management',
    href: '/processes',
    icon: Settings,
  },
  {
    name: 'Network Stack',
    href: '/network',
    icon: Network,
  },
  {
    name: 'Security Framework',
    href: '/security',
    icon: Lock,
  },
  {
    name: 'Development Tools',
    href: '/devtools',
    icon: Wrench,
  },
  {
    name: 'Productivity Suite',
    href: '/productivity',
    icon: FileText,
  },
  {
    name: 'Compatibility Layers',
    href: '/compatibility',
    icon: Layers,
  },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <div className="hidden border-r bg-muted/40 lg:block lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Globe className="h-6 w-6" />
            <span className="">Azora OS</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* Main Navigation */}
            <div className="py-2">
              <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Navigation
              </h3>
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Services */}
            <div className="py-2">
              <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Services
              </h3>
              {services.map((item) => (
                <Button
                  key={item.name}
                  variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Azora Modules */}
            <div className="py-2">
              <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Azora Modules
              </h3>
              <div className="grid gap-1">
                {azoraModules.map((item) => (
                  <Button
                    key={item.name}
                    variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span>{item.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* OS Components */}
            <div className="py-2">
              <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                OS Components
              </h3>
              <div className="grid gap-1">
                {osComponents.map((item) => (
                  <Button
                    key={item.name}
                    variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
