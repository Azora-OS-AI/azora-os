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
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  Play,
  CheckCircle,
  Lock
} from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Azora OS Fundamentals',
    description: 'Learn the core concepts and architecture of Azora OS',
    progress: 75,
    duration: '8 hours',
    students: 1247,
    rating: 4.9,
    level: 'Beginner',
    instructor: 'Dr. Elara Voss',
    completed: false
  },
  {
    id: 2,
    title: 'Advanced Integration Techniques',
    description: 'Master Microsoft and Google ecosystem integrations',
    progress: 45,
    duration: '12 hours',
    students: 892,
    rating: 4.8,
    level: 'Advanced',
    instructor: 'Prof. Aiden Chen',
    completed: false
  },
  {
    id: 3,
    title: 'Security Framework Deep Dive',
    description: 'Comprehensive security protocols and implementation',
    progress: 100,
    duration: '10 hours',
    students: 654,
    rating: 5.0,
    level: 'Expert',
    instructor: 'Maj. Sarah Kline',
    completed: true
  },
  {
    id: 4,
    title: 'AI Orchestration Mastery',
    description: 'Build and deploy autonomous AI systems',
    progress: 0,
    duration: '15 hours',
    students: 432,
    rating: 4.7,
    level: 'Expert',
    instructor: 'Dr. Marcus Hale',
    completed: false,
    locked: true
  }
]

const Academy: React.FC = () => {
  const totalCourses = courses.length
  const completedCourses = courses.filter(course => course.completed).length
  const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Azora Academy</h1>
        <p className="text-muted-foreground">
          Master Azora OS with comprehensive training programs
        </p>
      </div>

      {/* Learning Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}/{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedCourses / totalCourses) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProgress.toFixed(0)}%</div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Badges earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
          <CardDescription>
            Explore our comprehensive Azora OS training programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className={`transition-all hover:shadow-md ${course.locked ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                    {course.locked && <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress: {course.progress}%</span>
                      <span>{course.duration}</span>
                    </div>
                    <Progress value={course.progress} className="w-full" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                        <span>by {course.instructor}</span>
                      </div>
                      <Button
                        disabled={course.locked}
                        className="ml-auto"
                      >
                        {course.completed ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            {course.progress > 0 ? 'Continue' : 'Start'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Path</CardTitle>
          <CardDescription>
            Follow our structured curriculum to become an Azora OS expert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Azora OS Fundamentals</h4>
                <p className="text-sm text-muted-foreground">Core concepts and architecture</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Integration Mastery</h4>
                <p className="text-sm text-muted-foreground">Microsoft and Google ecosystem integration</p>
              </div>
              <Badge>In Progress</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Advanced Security</h4>
                <p className="text-sm text-muted-foreground">Enterprise-grade security implementation</p>
              </div>
              <Badge variant="outline">Locked</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-medium">AI Orchestration</h4>
                <p className="text-sm text-muted-foreground">Autonomous system deployment</p>
              </div>
              <Badge variant="outline">Locked</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Academy
