import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Brain
} from 'lucide-react';

interface StudentDashboardProps {
  userId: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Fetch student data
  const { data: studentData, isLoading } = useQuery({
    queryKey: ['student-data', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/students/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch student data');
      return response.json();
    },
  });

  // Fetch current curriculum
  const { data: curriculumData } = useQuery({
    queryKey: ['student-curriculum', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/students/${userId}/curriculum`);
      if (!response.ok) throw new Error('Failed to fetch curriculum');
      return response.json();
    },
  });

  // Fetch progress data
  const { data: progressData } = useQuery({
    queryKey: ['student-progress', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/students/${userId}/progress`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json();
    },
  });

  // Fetch AI recommendations
  const { data: recommendations } = useQuery({
    queryKey: ['student-recommendations', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/ai/recommendations?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const student = studentData?.student;
  const curriculum = curriculumData?.curriculum;
  const progress = progressData?.progress;
  const aiRecommendations = recommendations?.recommendations || [];

  return (
    <div className="space-y-6">
      {/* Student Profile Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={student?.avatar} />
              <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                {student?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{student?.name}</h1>
              <p className="text-blue-100">Grade {student?.grade} • {student?.learningStyle} Learner</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{progress?.overallGrade || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">{progress?.completedLessons || 0} Lessons Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">{progress?.streakDays || 0} Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Learning Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions to accelerate your learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {aiRecommendations.map((rec: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">{rec.title}</h4>
                      <p className="text-sm text-blue-700 mt-1">{rec.description}</p>
                      <Button size="sm" className="mt-2" variant="outline">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Curriculum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Current Curriculum
          </CardTitle>
          <CardDescription>
            Your personalized learning path for this term
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {curriculum?.subjects?.map((subject: any) => (
              <div key={subject.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                  <Badge variant={subject.progress > 80 ? "default" : subject.progress > 60 ? "secondary" : "outline"}>
                    {subject.progress}% Complete
                  </Badge>
                </div>
                <Progress value={subject.progress} className="mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{subject.completedLessons}</div>
                    <div className="text-sm text-muted-foreground">Lessons Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{subject.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{subject.nextLesson}</div>
                    <div className="text-sm text-muted-foreground">Next Lesson</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No curriculum assigned yet.</p>
                <p className="text-sm">Contact your teacher or parent to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Learning Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {curriculum?.schedule?.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.time}</span>
                  <span className="text-sm text-muted-foreground">-</span>
                  <span className="text-sm font-medium">{item.subject}</span>
                </div>
                <Badge variant={item.completed ? "default" : "secondary"}>
                  {item.completed ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Done
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Start
                    </>
                  )}
                </Badge>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No schedule available for today.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {progress?.achievements?.map((achievement: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                </div>
              </div>
            )) || (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No achievements yet. Keep learning to earn badges!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};