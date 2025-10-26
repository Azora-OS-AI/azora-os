import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Target,
  Brain,
  FileText,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  BarChart3
} from 'lucide-react';
import { StudentDashboard } from './StudentDashboard';
import { ParentDashboard } from './ParentDashboard';
import { CurriculumManager } from './CurriculumManager';
import { AssessmentCenter } from './AssessmentCenter';
import { AIPanel } from './AIPanel';

interface EducationDashboardProps {
  userRole: 'student' | 'parent' | 'teacher' | 'admin';
  userId: string;
}

export const EducationDashboard: React.FC<EducationDashboardProps> = ({ userRole, userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch dashboard data based on user role
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['education-dashboard', userRole, userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/dashboard/${userRole}?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Fetch AI insights
  const { data: aiInsights } = useQuery({
    queryKey: ['ai-insights', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/ai/insights?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch AI insights');
      return response.json();
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
            <p className="text-sm text-red-700 mt-1">
              Unable to connect to the education service. Please check your connection and try again.
            </p>
            <Button
              onClick={() => queryClient.invalidateQueries(['education-dashboard'])}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => {
    const stats = dashboardData?.stats || {};

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome to Azora Education! 🎓
          </h1>
          <p className="text-blue-100">
            {userRole === 'student'
              ? "Continue your personalized learning journey with AI-powered education."
              : userRole === 'parent'
              ? "Monitor your children's progress and manage their educational journey."
              : "Manage curriculum, assessments, and student progress with intelligent insights."
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Currently enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedLessons || 0}</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Across all subjects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiInsights?.insights?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Personalized recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        {aiInsights?.insights && aiInsights.insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Learning Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your learning patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.insights.slice(0, 3).map((insight: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">{insight.title}</p>
                      <p className="text-sm text-blue-700">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recentActivity?.map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <Badge variant="secondary">{activity.time}</Badge>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard userId={userId} />;
      case 'parent':
        return <ParentDashboard userId={userId} />;
      case 'teacher':
        return <CurriculumManager userId={userId} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-6">
          <CurriculumManager userId={userId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <AssessmentCenter userId={userId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {renderRoleSpecificContent()}
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AIPanel userId={userId} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
};