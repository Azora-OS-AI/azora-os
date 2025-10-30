/**
 * AZORA PROPRIETARY LICENSE
 * 
 * Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
 * See LICENSE file for details.
 */

'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Zap,
  TrendingUp,
  Users,
  Globe,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  Trophy,
  Flame,
  Target,
  Award,
} from 'lucide-react'

/**
 * Azora Sapiens Dashboard
 * 
 * The main learning platform dashboard providing:
 * - Course browsing and enrollment
 * - Learning progress tracking
 * - Proof-of-Knowledge reward display
 * - Community collaboration features
 * - Achievement tracking
 */
export default function SapiensDashboard() {
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Chen',
    level: 'CKQ-3',
    totalPoints: 2450,
    streak: 14,
    coursesCompleted: 8,
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [coursesData, setCoursesData] = useState([
    {
      id: 1,
      title: 'Planetary Economic Intelligence',
      progress: 75,
      image: '📊',
      instructor: 'Dr. Azora Prime',
      duration: '12 weeks',
      students: 2847,
    },
    {
      id: 2,
      title: 'Constitutional AI Design',
      progress: 45,
      image: '⚖️',
      instructor: 'Professor Governance',
      duration: '10 weeks',
      students: 1560,
    },
    {
      id: 3,
      title: 'Blockchain Fundamentals',
      progress: 60,
      image: '⛓️',
      instructor: 'Dr. Ledger',
      duration: '8 weeks',
      students: 3200,
    },
  ])

  const [rewards, setRewards] = useState({
    weeklyEarned: 125.75,
    totalEarned: 2450.50,
    pending: 25.00,
    multiplier: 1.5,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950/20">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Azora Sapiens</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Learn & Earn with Proof-of-Knowledge</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <div className="rounded-lg bg-accent-100 px-4 py-2 dark:bg-accent-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Streak</p>
                <p className="flex items-center gap-1 text-xl font-bold text-accent-600 dark:text-accent-400">
                  <Flame className="h-5 w-5" />
                  {userProfile.streak} days
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 px-4 py-2 dark:bg-primary-900">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Level</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{userProfile.level}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section - Key Metrics */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Points */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Knowledge Points</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{userProfile.totalPoints}</p>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">+245 this month</p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Proof-of-Knowledge Rewards */}
          <div className="rounded-xl border border-accent-200 bg-gradient-to-br from-accent-50 to-primary-50 p-6 backdrop-blur dark:border-accent-800 dark:from-accent-950 dark:to-primary-950">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">aZAR Balance</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{rewards.weeklyEarned}</p>
                <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">+12.5 this week</p>
              </div>
              <div className="rounded-lg bg-accent-100 p-3 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Courses Completed */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Courses Completed</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{userProfile.coursesCompleted}</p>
                <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">4 in progress</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Community Impact */}
          <div className="rounded-xl border border-neutral-200 bg-white/50 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Cohort Impact</p>
                <p className="mt-2 text-3xl font-bold text-foreground">847</p>
                <p className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400">Students helped</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-8">
            {['Overview', 'Courses', 'Rewards', 'Community'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-neutral-600 hover:text-foreground dark:text-neutral-400 dark:hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        {(activeTab === 'overview' || activeTab === 'courses') && (
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Learning Path</h2>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                  Continue your ascension through the knowledge hierarchy
                </p>
              </div>
              <button className="hidden items-center gap-2 rounded-lg border border-primary-300 px-4 py-2 text-primary-600 hover:bg-primary-50 dark:border-primary-700 dark:hover:bg-primary-950 sm:flex">
                Browse All Courses
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coursesData.map((course) => (
                <div key={course.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white/50 backdrop-blur transition-all hover:border-primary-300 hover:shadow-lg dark:border-neutral-800 dark:hover:border-primary-600">
                  <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 px-6 py-8 text-center text-5xl">
                    {course.image}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{course.title}</h3>
                    <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{course.instructor}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Progress</span>
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{course.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden dark:bg-neutral-700">
                        <div
                          className="h-full bg-primary-600 transition-all duration-300 dark:bg-primary-400"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Course Meta */}
                    <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()} students
                      </div>
                    </div>

                    <button className="w-full rounded-lg bg-primary-600 py-2 font-medium text-white transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
                      {course.progress === 100 ? 'Completed' : 'Continue Learning'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {(activeTab === 'overview' || activeTab === 'rewards') && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Recent Achievements</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Trophy, title: 'First Course', desc: 'Complete your first course' },
                { icon: Award, title: '100 Days Streak', desc: 'Maintain learning streak' },
                { icon: Star, title: 'Top Contributor', desc: 'Help 50+ students' },
                { icon: Zap, title: 'Speed Learner', desc: 'Complete course in record time' },
              ].map((achievement, i) => (
                <div key={i} className="flex flex-col items-center rounded-xl border border-neutral-200 bg-white/50 p-6 text-center backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
                  <div className="mb-4 rounded-lg bg-accent-100 p-3 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{achievement.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
