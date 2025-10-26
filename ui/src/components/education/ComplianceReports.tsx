import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';

interface ComplianceReportsProps {
  userId: string;
  userRole?: string;
}

interface ComplianceReport {
  id: string;
  studentId: string;
  studentName: string;
  period: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  subjects: {
    name: string;
    hoursCompleted: number;
    requiredHours: number;
    grade: string;
    compliance: boolean;
  }[];
  attendance: {
    totalDays: number;
    presentDays: number;
    excusedDays: number;
    attendanceRate: number;
  };
  assessments: {
    total: number;
    passed: number;
    averageScore: number;
  };
  generatedAt: Date;
  dueDate: Date;
}

export const ComplianceReports: React.FC<ComplianceReportsProps> = ({
  userId,
  userRole = 'parent'
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-quarter');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Fetch compliance reports
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['compliance-reports', userId, selectedPeriod],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:4200/api/compliance/reports?userId=${userId}&period=${selectedPeriod}`
      );
      if (!response.ok) throw new Error('Failed to fetch compliance reports');
      return response.json();
    },
  });

  // Fetch compliance summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['compliance-summary', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/compliance/summary?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch compliance summary');
      return response.json();
    },
  });

  // Download report
  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`http://localhost:4200/api/compliance/reports/${reportId}/download`);
      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'non-compliant':
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (reportsLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Department of Education Compliance</h1>
              <p className="text-blue-100">
                Track and maintain homeschool compliance with state and federal requirements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Status</p>
                  <p className="text-2xl font-bold text-green-600">Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hours Completed</p>
                  <p className="text-2xl font-bold">{summary.totalHoursCompleted || 0}</p>
                  <p className="text-xs text-muted-foreground">of {summary.requiredHours || 180} required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                  <p className="text-2xl font-bold">{summary.averageGrade || 'A-'}</p>
                  <p className="text-xs text-muted-foreground">Across all subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">{summary.attendanceRate || 98}%</p>
                  <p className="text-xs text-muted-foreground">This quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="subjects">Subject Breakdown</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Period Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Reporting Period:</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Detailed reports for Department of Education submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports?.reports?.map((report: ComplianceReport) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{report.studentName[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{report.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          {getStatusBadge(report.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(report.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report.id)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadReport(report.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Report Details Modal */}
          {selectedReport && (
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const report = reports?.reports?.find((r: ComplianceReport) => r.id === selectedReport);
                  if (!report) return null;

                  return (
                    <div className="space-y-6">
                      {/* Subject Compliance */}
                      <div>
                        <h4 className="font-semibold mb-4">Subject Compliance</h4>
                        <div className="space-y-3">
                          {report.subjects.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium">{subject.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {subject.hoursCompleted} / {subject.requiredHours} hours
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant={subject.grade === 'A' || subject.grade === 'B' ? 'default' : 'secondary'}>
                                  Grade: {subject.grade}
                                </Badge>
                                {subject.compliance ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Attendance */}
                      <div>
                        <h4 className="font-semibold mb-4">Attendance Summary</h4>
                        <div className="grid gap-4 md:grid-cols-3">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold">{report.attendance.totalDays}</p>
                              <p className="text-sm text-muted-foreground">Total Days</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-green-600">{report.attendance.presentDays}</p>
                              <p className="text-sm text-muted-foreground">Present</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold">{report.attendance.attendanceRate}%</p>
                              <p className="text-sm text-muted-foreground">Attendance Rate</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Assessments */}
                      <div>
                        <h4 className="font-semibold mb-4">Assessment Results</h4>
                        <div className="grid gap-4 md:grid-cols-3">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold">{report.assessments.total}</p>
                              <p className="text-sm text-muted-foreground">Total Assessments</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-green-600">{report.assessments.passed}</p>
                              <p className="text-sm text-muted-foreground">Passed</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold">{report.assessments.averageScore}%</p>
                              <p className="text-sm text-muted-foreground">Average Score</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject-by-Subject Compliance</CardTitle>
              <CardDescription>
                Detailed breakdown of compliance by subject area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary?.subjects?.map((subject: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{subject.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subject.compliance ? 'compliant' : 'non-compliant')}
                        <span className="text-sm text-muted-foreground">
                          {subject.hoursCompleted}/{subject.requiredHours} hours
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(subject.hoursCompleted / subject.requiredHours) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Grade</p>
                        <p className="font-semibold">{subject.grade}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Assessments</p>
                        <p className="font-semibold">{subject.assessmentsCompleted}/{subject.totalAssessments}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department of Education Requirements</CardTitle>
              <CardDescription>
                State and federal homeschooling requirements checklist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary?.requirements?.map((requirement: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {requirement.met ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{requirement.name}</p>
                        <p className="text-sm text-muted-foreground">{requirement.description}</p>
                      </div>
                    </div>
                    <Badge variant={requirement.met ? 'default' : 'destructive'}>
                      {requirement.met ? 'Met' : 'Not Met'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};