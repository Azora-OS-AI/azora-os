import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  Target,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Upload,
  Download
} from 'lucide-react';

interface CurriculumManagerProps {
  userId: string;
  userRole?: string;
}

export const CurriculumManager: React.FC<CurriculumManagerProps> = ({ userId, userRole }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch curriculum data
  const { data: curriculumData, isLoading } = useQuery({
    queryKey: ['curriculum', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/curriculum?teacherId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch curriculum');
      return response.json();
    },
  });

  // Fetch students for assignment
  const { data: studentsData } = useQuery({
    queryKey: ['teacher-students', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4200/api/teachers/${userId}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
  });

  // Create curriculum mutation
  const createCurriculumMutation = useMutation({
    mutationFn: async (curriculumData: any) => {
      const response = await fetch('http://localhost:4200/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...curriculumData, createdBy: userId }),
      });
      if (!response.ok) throw new Error('Failed to create curriculum');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['curriculum']);
      setIsCreateDialogOpen(false);
    },
  });

  // Update curriculum mutation
  const updateCurriculumMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`http://localhost:4200/api/curriculum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update curriculum');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['curriculum']);
      setEditingCurriculum(null);
    },
  });

  // Delete curriculum mutation
  const deleteCurriculumMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`http://localhost:4200/api/curriculum/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete curriculum');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['curriculum']);
    },
  });

  const curricula = curriculumData?.curricula || [];
  const students = studentsData?.students || [];

  const filteredCurricula = curricula.filter((curriculum: any) =>
    curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curriculum.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                <BookOpen className="h-5 w-5" />
                Curriculum Management
              </CardTitle>
              <CardDescription>
                Create, manage, and assign educational content to students
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Curriculum
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Curriculum</DialogTitle>
                  <DialogDescription>
                    Design a comprehensive curriculum for your students
                  </DialogDescription>
                </DialogHeader>
                <CurriculumForm
                  onSubmit={(data) => createCurriculumMutation.mutate(data)}
                  isLoading={createCurriculumMutation.isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search curricula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSubject || ''} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Curriculum Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCurricula
              .filter((curriculum: any) => !selectedSubject || curriculum.subject === selectedSubject)
              .map((curriculum: any) => (
                <Card key={curriculum.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{curriculum.title}</CardTitle>
                        <CardDescription>{curriculum.subject} • Grade {curriculum.grade}</CardDescription>
                      </div>
                      <Badge variant="secondary">{curriculum.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {curriculum.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {curriculum.units?.length || 0} Units
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {curriculum.assignedStudents || 0} Students
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {curriculum.standards?.length || 0} Standards
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {curriculum.estimatedHours || 0}h
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCurriculum(curriculum)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this curriculum?')) {
                            deleteCurriculumMutation.mutate(curriculum.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {filteredCurricula.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No curricula found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedSubject
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first curriculum.'}
              </p>
              {!searchTerm && !selectedSubject && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Curriculum
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Curriculum Dialog */}
      {editingCurriculum && (
        <Dialog open={!!editingCurriculum} onOpenChange={() => setEditingCurriculum(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Curriculum</DialogTitle>
              <DialogDescription>
                Update curriculum details and content
              </DialogDescription>
            </DialogHeader>
            <CurriculumForm
              initialData={editingCurriculum}
              onSubmit={(data) => updateCurriculumMutation.mutate({
                id: editingCurriculum.id,
                data
              })}
              isLoading={updateCurriculumMutation.isLoading}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Student Assignment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Assignments
          </CardTitle>
          <CardDescription>
            Overview of curriculum assignments and student progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.slice(0, 5).map((student: any) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.assignedCurricula || 0} Curricula</p>
                    <p className="text-xs text-muted-foreground">
                      {student.completedLessons || 0} Lessons Done
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Progress
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Curriculum Form Component
interface CurriculumFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const CurriculumForm: React.FC<CurriculumFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subject: initialData?.subject || '',
    grade: initialData?.grade || '',
    description: initialData?.description || '',
    objectives: initialData?.objectives || '',
    duration: initialData?.duration || '',
    standards: initialData?.standards || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Algebra Fundamentals"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Subject</label>
          <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Grade Level</label>
          <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 13 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i === 0 ? 'Kindergarten' : `Grade ${i}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Duration (weeks)</label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="12"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the curriculum goals and content..."
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Learning Objectives</label>
        <Textarea
          value={formData.objectives}
          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
          placeholder="List the main learning objectives..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Curriculum' : 'Create Curriculum'}
        </Button>
      </div>
    </form>
  );
};