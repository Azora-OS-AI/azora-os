import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Download,
  Eye,
  Award
} from 'lucide-react';

interface ParentDashboardProps {
  userId: string;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ userId }) => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Fetch parent's children
  const { data: childrenData } = useQuery({
    queryKey: ['parent-children', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/parents/${userId}/children`);
      if (!response.ok) throw new Error('Failed to fetch children data');
      return response.json();
    },
  });

  // Fetch selected student's detailed data
  const { data: studentDetail } = useQuery({
    queryKey: ['student-detail', selectedStudent],
    queryFn: async () => {
      if (!selectedStudent) return null;
      const response = await fetch(`http://localhost:4200/api/students/${selectedStudent}/detail`);
      if (!response.ok) throw new Error('Failed to fetch student detail');
      return response.json();
    },
    enabled: !!selectedStudent,
  });

  // Fetch progress reports
  const { data: reportsData } = useQuery({
    queryKey: ['parent-reports', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/parents/${userId}/reports`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
  });

  const children = childrenData?.children || [];
  const currentStudent = studentDetail?.student;
  const reports = reportsData?.reports || [];

  return (
    <div className="space-y-6">
      {/* Parent Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              <p className="text-green-100">Monitor and support your children's education</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {children.length} Children
              </Badge>
              <Button variant="secondary" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Children
          </CardTitle>
          <CardDescription>
            Select a child to view their detailed progress and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child: any) => (
              <Card
                key={child.id}
                className={`cursor-pointer transition-all ${
                  selectedStudent === child.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedStudent(child.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={child.avatar} />
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">Grade {child.grade}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {child.progress}% Complete
                        </Badge>
                        <Badge
                          variant={child.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {child.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Student Detail */}
      {selectedStudent && currentStudent && (
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentStudent.name}'s Progress Overview</CardTitle>
                <CardDescription>
                  Comprehensive view of academic performance and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Overall Progress */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Overall Performance</h3>
                    <div className="space-y-3">
                      {currentStudent.subjects?.map((subject: any) => (
                        <div key={subject.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{subject.name}</span>
                            <span>{subject.score}%</span>
                          </div>
                          <Progress value={subject.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recent Activity</h3>
                    <div className="space-y-3">
                      {currentStudent.recentActivity?.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                          <Badge variant="secondary">{activity.score}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Results</CardTitle>
                <CardDescription>
                  Detailed breakdown of test scores and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentStudent.assessments?.map((assessment: any) => (
                    <div key={assessment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{assessment.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={assessment.score >= 80 ? "default" : assessment.score >= 60 ? "secondary" : "destructive"}>
                            {assessment.score}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">{assessment.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{assessment.subject}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Grade: </span>
                          {assessment.grade}
                        </div>
                        <div>
                          <span className="font-medium">Time Spent: </span>
                          {assessment.timeSpent} min
                        </div>
                      </div>
                      {assessment.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>AI Feedback:</strong> {assessment.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No assessments completed yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  View and manage your child's learning schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <div key={day} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">{day}</h4>
                      <div className="space-y-2">
                        {currentStudent.schedule?.[day.toLowerCase()]?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{item.time}</span>
                              <span className="text-sm">{item.subject}</span>
                            </div>
                            <Badge variant={item.completed ? "default" : "secondary"}>
                              {item.completed ? "Done" : "Pending"}
                            </Badge>
                          </div>
                        )) || (
                          <p className="text-sm text-muted-foreground">No scheduled activities</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>
                  Messages and updates from teachers and the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentStudent.messages?.map((message: any) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{message.sender.name}</p>
                            <p className="text-xs text-muted-foreground">{message.date}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{message.type}</Badge>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Progress Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Progress Reports
          </CardTitle>
          <CardDescription>
            Download comprehensive progress reports for your children
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report: any) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.studentName} • {report.period} • {report.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reports available yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};