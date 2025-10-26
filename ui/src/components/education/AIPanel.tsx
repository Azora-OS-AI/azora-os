import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Brain,
  MessageSquare,
  Lightbulb,
  Calculator,
  BookOpen,
  Target,
  TrendingUp,
  HelpCircle,
  Send,
  Sparkles,
  Zap
} from 'lucide-react';

interface AIPanelProps {
  userId: string;
  userRole?: string;
}

export const AIPanel: React.FC<AIPanelProps> = ({ userId, userRole }) => {
  const [mathProblem, setMathProblem] = useState('');
  const [lessonRequest, setLessonRequest] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Fetch AI insights
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['ai-insights', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/ai/insights?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch AI insights');
      return response.json();
    },
  });

  // Solve math problem mutation
  const solveMathMutation = useMutation({
    mutationFn: async (problem: string) => {
      const response = await fetch('http://localhost:4200/api/math/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, type: 'algebra' }),
      });
      if (!response.ok) throw new Error('Failed to solve math problem');
      return response.json();
    },
  });

  // Generate lesson plan mutation
  const generateLessonMutation = useMutation({
    mutationFn: async (request: any) => {
      const response = await fetch('http://localhost:4200/api/ai/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error('Failed to generate lesson plan');
      return response.json();
    },
  });

  // AI chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('http://localhost:4200/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId, context: chatHistory }),
      });
      if (!response.ok) throw new Error('Failed to get AI response');
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }, { role: 'assistant', content: data.response }]);
      setChatMessage('');
    },
  });

  const handleSolveMath = () => {
    if (mathProblem.trim()) {
      solveMathMutation.mutate(mathProblem);
    }
  };

  const handleGenerateLesson = () => {
    if (lessonRequest.trim()) {
      generateLessonMutation.mutate({
        subject: 'General',
        grade: 5,
        studentLevel: 'intermediate',
        objectives: [lessonRequest],
        duration: 60,
        studentId: userId
      });
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      chatMutation.mutate(chatMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Learning Assistant</h1>
              <p className="text-purple-100">
                Your intelligent companion for personalized education and support
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="math">Math Solver</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Learning Assistant
              </CardTitle>
              <CardDescription>
                Ask questions, get explanations, and receive personalized learning support
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chat History */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation with your AI learning assistant!</p>
                    <p className="text-sm mt-2">Ask about any subject, get homework help, or discuss learning strategies.</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            <Brain className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                {chatMutation.isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || chatMutation.isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <HelpCircle className="h-6 w-6" />
              <span className="text-sm">Explain Concept</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Study Tips</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Target className="h-6 w-6" />
              <span className="text-sm">Practice Questions</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Progress Review</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="math" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                AI Math Solver
              </CardTitle>
              <CardDescription>
                Get step-by-step solutions to math problems instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Enter your math problem</label>
                <Textarea
                  value={mathProblem}
                  onChange={(e) => setMathProblem(e.target.value)}
                  placeholder="e.g., 2x + 3 = 7, or solve for x in 3x - 5 = 10"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSolveMath}
                disabled={!mathProblem.trim() || solveMathMutation.isLoading}
                className="w-full"
              >
                {solveMathMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Solving...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Solve Problem
                  </>
                )}
              </Button>

              {solveMathMutation.data && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Solution</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Problem:</strong> {solveMathMutation.data.problem}</p>
                          <p><strong>Answer:</strong> {solveMathMutation.data.solution}</p>
                          {solveMathMutation.data.steps && (
                            <div>
                              <strong>Steps:</strong>
                              <ol className="list-decimal list-inside mt-1 space-y-1">
                                {solveMathMutation.data.steps.map((step: string, index: number) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Lesson Plan Generator
              </CardTitle>
              <CardDescription>
                Create personalized lesson plans tailored to your learning needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What would you like to learn?</label>
                <Textarea
                  value={lessonRequest}
                  onChange={(e) => setLessonRequest(e.target.value)}
                  placeholder="e.g., fractions and decimals, photosynthesis, basic algebra..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerateLesson}
                disabled={!lessonRequest.trim() || generateLessonMutation.isLoading}
                className="w-full"
              >
                {generateLessonMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </Button>

              {generateLessonMutation.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Personalized Lesson Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {generateLessonMutation.data.lessonPlan?.objectives?.map((obj: string, index: number) => (
                            <li key={index}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Activities</h4>
                        <div className="space-y-2">
                          {generateLessonMutation.data.lessonPlan?.activities?.map((activity: any, index: number) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <h5 className="font-medium">{activity.title}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                              <Badge variant="secondary" className="mt-2">{activity.duration} min</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Learning Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations and performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : insights?.insights ? (
                <div className="space-y-4">
                  {insights.insights.map((insight: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900">{insight.title}</h4>
                            <p className="text-sm text-blue-700 mt-1">{insight.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{insight.category}</Badge>
                              <Badge variant="outline">{insight.priority}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No insights available yet.</p>
                  <p className="text-sm mt-2">Complete some assessments to get personalized AI insights.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};