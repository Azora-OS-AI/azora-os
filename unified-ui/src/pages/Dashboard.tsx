/*
AZORA PROPRIETARY LICENSE
Copyright (c) 2025 Azora ES (Pty) Ltd. All Rights Reserved.
See LICENSE file for details.
*/

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Shield,
  Zap,
  Globe,
  Users,
  BarChart3,
  Settings,
  Play,
  Square
} from 'lucide-react'
import { useAzoraOS } from '../contexts/AzoraOSContext'

const Dashboard: React.FC = () => {
  const { systemMetrics, activeServices, services, startService, stopService } = useAzoraOS()

  const stats = [
    {
      name: 'Active Services',
      value: activeServices.length,
      icon: Zap,
      description: `${services.length - activeServices.length} services available`
    },
    {
      name: 'System Health',
      value: '98%',
      icon: Activity,
      description: 'All systems operational'
    },
    {
      name: 'Network Status',
      value: 'Online',
      icon: Globe,
      description: 'Connected to all services'
    },
    {
      name: 'Active Users',
      value: '1,247',
      icon: Users,
      description: '+12% from last month'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Azora OS Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the unified Azora Operating System interface
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.cpu.toFixed(1)}%</div>
            <Progress value={systemMetrics.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.memory.toFixed(1)}%</div>
            <Progress value={systemMetrics.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.storage.toFixed(1)}%</div>
            <Progress value={systemMetrics.storage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Network Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.network.toFixed(1)}%</div>
            <Progress value={systemMetrics.network} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Services Management */}
      <Card>
        <CardHeader>
          <CardTitle>System Services</CardTitle>
          <CardDescription>
            Manage Azora OS core services and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const isActive = activeServices.includes(service)
              return (
                <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium capitalize">
                      {service.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <Button
                    variant={isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => isActive ? stopService(service) : startService(service)}
                  >
                    {isActive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access frequently used Azora OS features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-24 flex flex-col items-center justify-center space-y-2">
              <Shield className="h-8 w-8" />
              <span>Security Center</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-8 w-8" />
              <span>Analytics</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-8 w-8" />
              <span>System Settings</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
              <Users className="h-8 w-8" />
              <span>User Management</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
