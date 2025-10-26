import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  FileText,
  PlayCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  AlertCircle,
  BarChart3,
  Users,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

interface AssessmentCenterProps {
  userId: string;
  userRole?: string;
}

export const AssessmentCenter: React.FC<AssessmentCenterProps> = ({ userId, userRole }) => {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const queryClient = useQueryClient();

  // Fetch assessments based on role
  const { data: assessmentsData, isLoading } = useQuery({
    queryKey: ['assessments', userId, userRole],
    queryFn: async () => {
      const endpoint = userRole === 'student'
        ? `http://localhost:4200/api/students/${userId}/assessments`
        : `http://localhost:4200/api/assessments?createdBy=${userId}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch assessments');
      return response.json();
    },
  });

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async ({ assessmentId, answers, timeSpent }: any) => {
      const response = await fetch(`http://localhost:4200/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: userId,
          answers: Object.entries(answers).map(([questionIndex, answer]) => ({
            questionIndex: parseInt(questionIndex),
            answer
          })),
          timeSpent
        }),
      });
      if (!response.ok) throw new Error('Failed to submit assessment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['assessments']);
      setIsAssessmentActive(false);
      setSelectedAssessment(null);
      setAnswers({});
      setTimeRemaining(null);
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAssessmentActive && timeRemaining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            // Auto-submit when time runs out
            handleSubmitAssessment();
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAssessmentActive, timeRemaining]);

  const startAssessment = (assessment: any) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(assessment.timeLimit * 60); // Convert minutes to seconds
    setIsAssessmentActive(true);
  };

  const handleAnswerChange = (questionIndex: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitAssessment = () => {
    if (!selectedAssessment) return;

    const timeSpent = selectedAssessment.timeLimit * 60 - (timeRemaining || 0);
    submitAssessmentMutation.mutate({
      assessmentId: selectedAssessment.id,
      answers,
      timeSpent
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const assessments = assessmentsData?.assessments || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAssessmentActive && selectedAssessment) {
    const currentQuestion = selectedAssessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Assessment Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{selectedAssessment.title}</h1>
                <p className="text-muted-foreground">{selectedAssessment.subject}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {timeRemaining ? formatTime(timeRemaining) : '00:00'}
                </div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
              </div>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
            </p>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

                {currentQuestion.type === 'multiple_choice' && (
                  <RadioGroup
                    value={answers[currentQuestionIndex] || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)}
                  >
                    {currentQuestion.options.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'true_false' && (
                  <RadioGroup
                    value={answers[currentQuestionIndex] || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="true" id="true" />
                      <label htmlFor="true" className="flex-1 cursor-pointer">True</label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="false" id="false" />
                      <label htmlFor="false" className="flex-1 cursor-pointer">False</label>
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === 'short_answer' && (
                  <Textarea
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={4}
                  />
                )}

                {currentQuestion.type === 'essay' && (
                  <Textarea
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                    placeholder="Write your detailed answer here..."
                    rows={8}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitAssessment}
                    disabled={submitAssessmentMutation.isLoading}
                  >
                    {submitAssessmentMutation.isLoading ? 'Submitting...' : 'Submit Assessment'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assessment Center
              </CardTitle>
              <CardDescription>
                {userRole === 'student'
                  ? 'Take assessments and track your progress'
                  : 'Create and manage assessments for your students'
                }
              </CardDescription>
            </div>
            {userRole !== 'student' && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments
              .filter((assessment: any) => !assessment.completed)
              .map((assessment: any) => (
                <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.subject}</CardDescription>
                      </div>
                      <Badge variant="secondary">{assessment.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{assessment.timeLimit} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4" />
                        <span>{assessment.questions?.length || 0} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4" />
                        <span>{assessment.totalPoints} points</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => startAssessment(assessment)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Assessment
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          {assessments.filter((a: any) => !a.completed).length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No assessments available</h3>
              <p className="text-muted-foreground">
                {userRole === 'student'
                  ? 'Check back later for new assessments from your teacher.'
                  : 'Create your first assessment to get started.'
                }
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments
              .filter((assessment: any) => assessment.completed)
              .map((assessment: any) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <CardDescription>{assessment.subject}</CardDescription>
                      </div>
                      <Badge variant={assessment.score >= 80 ? "default" : assessment.score >= 60 ? "secondary" : "destructive"}>
                        {assessment.score}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Completed:</span>
                        <span>{assessment.completedAt}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Spent:</span>
                        <span>{assessment.timeSpent} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Grade:</span>
                        <span className="font-semibold">{assessment.grade}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {userRole !== 'student' ? (
            <div className="space-y-6">
              {assessments.map((assessment: any) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription>
                      {assessment.subject} • {assessment.questions?.length || 0} questions • {assessment.totalPoints} points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{assessment.submissions || 0}</div>
                        <p className="text-sm text-muted-foreground">Submissions</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{assessment.averageScore || 0}%</div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{assessment.passRate || 0}%</div>
                        <p className="text-sm text-muted-foreground">Pass Rate</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{assessment.completionRate || 0}%</div>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </div>
                    </div>

                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Detailed Results
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Assessment Analytics</h3>
                <p className="text-muted-foreground">
                  Detailed performance analytics will be available here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};