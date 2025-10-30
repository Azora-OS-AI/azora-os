/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * SECONDARY EDUCATION CORE
 * 
 * Comprehensive secondary education system (Grades 8-12)
 * Aligned with UMALUSI and Department of Basic Education (DBE)
 * NSC (National Senior Certificate) preparation
 * Enhanced with AI and career preparation
 * 
 * Powered by Elara AI and Academic Agents
 */

import { EventEmitter } from 'events'
import { elaraIntegration } from '../../genome/elara-integration'

export interface SecondaryGrade {
  gradeLevel: '8' | '9' | '10' | '11' | '12'
  phase: 'FET' | 'Senior' // FET = Further Education and Training (10-12)
  subjects: SecondarySubject[]
  streams: AcademicStream[]
  assessmentWeighting: AssessmentWeighting
}

export interface SecondarySubject {
  id: string
  name: string
  code: string
  subjectType: 'Core' | 'Elective' | 'Specialized'
  weeklyHours: number
  credits: number
  curriculum: CurriculumStandard
  examBoard: 'DBE' | 'IEB' | 'Cambridge'
  nscLevel?: 'HL' | 'SAL' // Home Language or Second Additional Language
}

export interface AcademicStream {
  id: string
  name: string
  description: string
  requiredSubjects: string[]
  electiveOptions: string[]
  careerPaths: string[]
  universityPreparation: string[]
}

export interface AssessmentWeighting {
  continuousAssessment: number // SBA - School Based Assessment
  midYearExam?: number
  trialExam?: number
  finalExam: number
  portfolios?: number
  practicals?: number
}

export interface CurriculumStandard {
  framework: 'CAPS' | 'IEB' | 'Cambridge'
  topics: Topic[]
  examPapers: ExamPaper[]
  practicalTasks: PracticalTask[]
  PAT?: PAT // Practical Assessment Task (for certain subjects)
}

export interface ExamPaper {
  paperId: string
  name: string
  duration: number // minutes
  marks: number
  sections: ExamSection[]
  cognitiveLevel: CognitiveDistribution
}

export interface ExamSection {
  sectionNumber: number
  name: string
  marks: number
  questionTypes: string[]
  duration: number
}

export interface CognitiveDistribution {
  knowledge: number // %
  routine: number // %
  complex: number // %
  problem_solving: number // %
}

export interface PracticalTask {
  id: string
  name: string
  duration: number
  marks: number
  requirements: string[]
  rubric: Rubric
}

export interface PAT {
  name: string
  duration: string // e.g., "Term 1-3"
  totalMarks: number
  components: PATComponent[]
  submissionDeadline: Date
}

export interface PATComponent {
  name: string
  marks: number
  description: string
  milestones: Milestone[]
}

export interface Milestone {
  week: number
  task: string
  completion: number // %
}

export interface Topic {
  id: string
  title: string
  content: string[]
  learningOutcomes: string[]
  resources: Resource[]
  assessmentTasks: string[]
}

export interface Resource {
  type: 'video' | 'document' | 'simulation' | 'interactive' | 'vr-lab'
  url: string
  title: string
  provider?: string
}

export interface Rubric {
  criteria: Criterion[]
  levels: PerformanceLevel[]
}

export interface Criterion {
  id: string
  description: string
  weight: number
}

export interface PerformanceLevel {
  level: number
  descriptor: string
  percentage: number
  code: string // e.g., '7' for Outstanding Achievement
}

export class SecondaryEducationCore extends EventEmitter {
  private grades: Map<string, SecondaryGrade> = new Map()
  private streams: Map<string, AcademicStream> = new Map()
  private studentRecords: Map<string, StudentRecord> = new Map()
  private academicAgents: Map<string, SpecializedAgent> = new Map()

  constructor() {
    super()
    this.initializeGrades()
    this.initializeStreams()
    this.initializeAcademicAgents()
  }

  /**
   * Initialize secondary grades (8-12)
   */
  private initializeGrades() {
    // Grades 8-9 (Senior Phase)
    for (let grade = 8; grade <= 9; grade++) {
      this.grades.set(grade.toString(), {
        gradeLevel: grade.toString() as any,
        phase: 'Senior',
        subjects: this.getSeniorPhaseSubjects(grade),
        streams: [],
        assessmentWeighting: {
          continuousAssessment: 60,
          finalExam: 40
        }
      })
    }

    // Grades 10-12 (FET Phase - NSC Preparation)
    for (let grade = 10; grade <= 12; grade++) {
      this.grades.set(grade.toString(), {
        gradeLevel: grade.toString() as any,
        phase: 'FET',
        subjects: this.getFETPhaseSubjects(grade),
        streams: Array.from(this.streams.values()),
        assessmentWeighting: {
          continuousAssessment: 25, // SBA
          trialExam: grade === 12 ? 25 : undefined, // Grade 12 trial exam
          finalExam: grade === 12 ? 75 : 50 // NSC final exams
        }
      })
    }
  }

  /**
   * Initialize academic streams
   */
  private initializeStreams() {
    // STEM Stream
    this.streams.set('stem', {
      id: 'stem',
      name: 'Science, Technology, Engineering & Mathematics',
      description: 'For students pursuing engineering, medicine, computer science, and scientific careers',
      requiredSubjects: [
        'Mathematics',
        'Physical Sciences',
        'Life Sciences',
        'English Home Language',
        'Afrikaans FAL'
      ],
      electiveOptions: [
        'Information Technology',
        'Computer Application Technology',
        'Engineering Graphics & Design'
      ],
      careerPaths: [
        'Engineering',
        'Medicine',
        'Computer Science',
        'Data Science',
        'Biotechnology',
        'Architecture'
      ],
      universityPreparation: [
        'University of Cape Town',
        'University of Pretoria',
        'Stellenbosch University',
        'University of the Witwatersrand'
      ]
    })

    // Commerce & Economics Stream
    this.streams.set('commerce', {
      id: 'commerce',
      name: 'Commerce & Economics',
      description: 'For students pursuing business, finance, accounting, and economics',
      requiredSubjects: [
        'Mathematics',
        'Accounting',
        'Economics',
        'Business Studies',
        'English Home Language'
      ],
      electiveOptions: [
        'Mathematical Literacy',
        'Information Technology',
        'Tourism'
      ],
      careerPaths: [
        'Chartered Accountant',
        'Financial Analyst',
        'Economist',
        'Business Consultant',
        'Entrepreneur',
        'Investment Banker'
      ],
      universityPreparation: [
        'UCT Graduate School of Business',
        'Gordon Institute of Business Science',
        'Stellenbosch Business School'
      ]
    })

    // Humanities Stream
    this.streams.set('humanities', {
      id: 'humanities',
      name: 'Humanities & Social Sciences',
      description: 'For students pursuing law, social sciences, education, and humanities',
      requiredSubjects: [
        'English Home Language',
        'History',
        'Geography',
        'Life Orientation'
      ],
      electiveOptions: [
        'Afrikaans Home Language',
        'French SAL',
        'Drama',
        'Music',
        'Visual Arts'
      ],
      careerPaths: [
        'Law',
        'Psychology',
        'Education',
        'Journalism',
        'Social Work',
        'Public Policy'
      ],
      universityPreparation: [
        'University of Cape Town Faculty of Law',
        'Rhodes University',
        'University of Johannesburg'
      ]
    })

    // Digital & Tech Innovation Stream (Azora Enhanced)
    this.streams.set('digital-tech', {
      id: 'digital-tech',
      name: 'Digital Innovation & Technology',
      description: 'Azora-enhanced stream for future tech leaders and digital innovators',
      requiredSubjects: [
        'Mathematics',
        'Information Technology',
        'Computer Application Technology',
        'English Home Language'
      ],
      electiveOptions: [
        'Physical Sciences',
        'Engineering Graphics & Design',
        'Business Studies'
      ],
      careerPaths: [
        'Software Engineer',
        'AI/ML Specialist',
        'Blockchain Developer',
        'UX/UI Designer',
        'Cybersecurity Analyst',
        'Product Manager'
      ],
      universityPreparation: [
        'Azora Sapiens University',
        'MIT',
        'Stanford',
        'UCT Computer Science'
      ]
    })
  }

  /**
   * Initialize specialized Academic Agents
   */
  private async initializeAcademicAgents() {
    const specializations = [
      { role: 'Mathematics Master', subjects: ['Mathematics', 'Mathematical Literacy'] },
      { role: 'Physical Sciences Expert', subjects: ['Physical Sciences'] },
      { role: 'Life Sciences Specialist', subjects: ['Life Sciences'] },
      { role: 'Languages Professor', subjects: ['English HL', 'Afrikaans FAL'] },
      { role: 'Commerce Consultant', subjects: ['Accounting', 'Economics', 'Business Studies'] },
      { role: 'Technology Mentor', subjects: ['IT', 'CAT', 'Engineering Graphics'] },
      { role: 'Humanities Scholar', subjects: ['History', 'Geography'] },
      { role: 'NSC Exam Strategist', subjects: ['All'] }
    ]

    for (const spec of specializations) {
      const agent: SpecializedAgent = {
        id: `agent-${spec.role.toLowerCase().replace(/\s+/g, '-')}`,
        role: spec.role,
        subjects: spec.subjects,
        qualifications: ['B.Ed', 'M.Ed', 'PhD (where applicable)'],
        experience: 'AI-Enhanced with 1000+ student success stories',
        teachingStyle: ['Personalized', 'Adaptive', 'Engaging', 'Results-driven'],
        elaraIntegrated: true,
        capabilities: [
          'Real-time tutoring',
          'Exam preparation',
          'Assignment assistance',
          'Concept clarification',
          'Study plan creation',
          'Motivation & support'
        ]
      }
      this.academicAgents.set(agent.id, agent)
    }
  }

  /**
   * Get subjects for Senior Phase (Grades 8-9)
   */
  private getSeniorPhaseSubjects(grade: number): SecondarySubject[] {
    return [
      {
        id: `g${grade}-math`,
        name: 'Mathematics',
        code: `DBE-G${grade}-MATH`,
        subjectType: 'Core',
        weeklyHours: 4.5,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-english`,
        name: 'English Home Language',
        code: `DBE-G${grade}-ENG-HL`,
        subjectType: 'Core',
        weeklyHours: 5,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE',
        nscLevel: 'HL'
      },
      {
        id: `g${grade}-natural-science`,
        name: 'Natural Sciences',
        code: `DBE-G${grade}-NS`,
        subjectType: 'Core',
        weeklyHours: 3,
        credits: 10,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-technology`,
        name: 'Technology',
        code: `DBE-G${grade}-TECH`,
        subjectType: 'Core',
        weeklyHours: 2,
        credits: 10,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-coding`,
        name: 'Advanced Coding & AI',
        code: `AZORA-G${grade}-CODE`,
        subjectType: 'Specialized',
        weeklyHours: 3,
        credits: 10,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      }
    ]
  }

  /**
   * Get subjects for FET Phase (Grades 10-12)
   */
  private getFETPhaseSubjects(grade: number): SecondarySubject[] {
    const coreSubjects: SecondarySubject[] = [
      {
        id: `g${grade}-math`,
        name: 'Mathematics',
        code: `NSC-MATH`,
        subjectType: 'Core',
        weeklyHours: 4.5,
        credits: 20,
        curriculum: this.getMathematicsCurriculum(grade),
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-english-hl`,
        name: 'English Home Language',
        code: `NSC-ENG-HL`,
        subjectType: 'Core',
        weeklyHours: 4.5,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE',
        nscLevel: 'HL'
      },
      {
        id: `g${grade}-physical-sciences`,
        name: 'Physical Sciences',
        code: `NSC-PHY-SCI`,
        subjectType: 'Elective',
        weeklyHours: 4.5,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-life-sciences`,
        name: 'Life Sciences',
        code: `NSC-LIFE-SCI`,
        subjectType: 'Elective',
        weeklyHours: 4,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-accounting`,
        name: 'Accounting',
        code: `NSC-ACC`,
        subjectType: 'Elective',
        weeklyHours: 4,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-it`,
        name: 'Information Technology',
        code: `NSC-IT`,
        subjectType: 'Elective',
        weeklyHours: 4,
        credits: 20,
        curriculum: this.getITCurriculum(grade),
        examBoard: 'DBE'
      },
      {
        id: `g${grade}-blockchain-ai`,
        name: 'Blockchain & AI Development',
        code: `AZORA-BLOCKCHAIN-AI`,
        subjectType: 'Specialized',
        weeklyHours: 4,
        credits: 20,
        curriculum: { framework: 'CAPS', topics: [], examPapers: [], practicalTasks: [] },
        examBoard: 'DBE'
      }
    ]

    return coreSubjects
  }

  /**
   * Get Mathematics curriculum (simplified)
   */
  private getMathematicsCurriculum(grade: number): CurriculumStandard {
    return {
      framework: 'CAPS',
      topics: [
        { id: 'algebra', title: 'Algebra', content: ['Equations', 'Inequalities', 'Functions'], learningOutcomes: [], resources: [], assessmentTasks: [] },
        { id: 'geometry', title: 'Euclidean Geometry', content: ['Theorems', 'Proofs', 'Circles'], learningOutcomes: [], resources: [], assessmentTasks: [] },
        { id: 'trig', title: 'Trigonometry', content: ['Functions', 'Identities', 'Equations'], learningOutcomes: [], resources: [], assessmentTasks: [] },
        { id: 'calculus', title: 'Differential Calculus', content: ['Limits', 'Derivatives', 'Applications'], learningOutcomes: [], resources: [], assessmentTasks: [] }
      ],
      examPapers: [
        {
          paperId: 'math-p1',
          name: 'Paper 1 - Algebra & Calculus',
          duration: 180,
          marks: 150,
          sections: [
            { sectionNumber: 1, name: 'Algebra', marks: 80, questionTypes: ['Multiple choice', 'Short answer', 'Long problems'], duration: 90 },
            { sectionNumber: 2, name: 'Calculus', marks: 70, questionTypes: ['Application problems', 'Proofs'], duration: 90 }
          ],
          cognitiveLevel: { knowledge: 20, routine: 35, complex: 30, problem_solving: 15 }
        },
        {
          paperId: 'math-p2',
          name: 'Paper 2 - Geometry & Trigonometry',
          duration: 180,
          marks: 150,
          sections: [],
          cognitiveLevel: { knowledge: 15, routine: 30, complex: 35, problem_solving: 20 }
        }
      ],
      practicalTasks: []
    }
  }

  /**
   * Get IT curriculum
   */
  private getITCurriculum(grade: number): CurriculumStandard {
    return {
      framework: 'CAPS',
      topics: [
        { id: 'programming', title: 'Programming (Delphi/Java)', content: [], learningOutcomes: [], resources: [], assessmentTasks: [] },
        { id: 'databases', title: 'Database Management', content: [], learningOutcomes: [], resources: [], assessmentTasks: [] },
        { id: 'web-dev', title: 'Web Development', content: [], learningOutcomes: [], resources: [], assessmentTasks: [] }
      ],
      examPapers: [],
      practicalTasks: [],
      PAT: {
        name: 'Practical Assessment Task',
        duration: 'Term 1-3',
        totalMarks: 150,
        components: [
          { name: 'Database Design', marks: 50, description: 'Create normalized database', milestones: [] },
          { name: 'Program Development', marks: 70, description: 'Develop complete application', milestones: [] },
          { name: 'Documentation', marks: 30, description: 'User manual and technical docs', milestones: [] }
        ],
        submissionDeadline: new Date('2026-08-31')
      }
    }
  }

  /**
   * Enroll student in secondary education
   */
  async enrollStudent(studentId: string, gradeLevel: string, streamId?: string) {
    const grade = this.grades.get(gradeLevel)
    if (!grade) {
      throw new Error(`Grade ${gradeLevel} not found`)
    }

    // Get stream if in FET phase
    let selectedStream
    if (grade.phase === 'FET' && streamId) {
      selectedStream = this.streams.get(streamId)
    }

    // Use Elara AI to create personalized study plan
    const studyPlan = await elaraIntegration.getEducationalHelp(
      `Create NSC study plan for Grade ${gradeLevel} student`,
      {
        studentId,
        gradeLevel,
        stream: selectedStream?.name,
        phase: grade.phase
      }
    )

    const record: StudentRecord = {
      studentId,
      gradeLevel,
      stream: selectedStream?.id,
      enrollmentDate: new Date(),
      subjects: [],
      academicAgents: [],
      studyPlan: studyPlan.response,
      nscTarget: gradeLevel === '12' ? 'Bachelor Pass' : undefined
    }

    this.studentRecords.set(studentId, record)
    this.emit('student-enrolled', record)

    return record
  }

  /**
   * Get NSC requirements
   */
  getNSCRequirements() {
    return {
      minimumSubjects: 7,
      compulsorySubjects: [
        'Home Language (HL or FAL)',
        'First Additional Language (HL or FAL)',
        'Mathematics or Mathematical Literacy',
        'Life Orientation'
      ],
      passingCriteria: {
        higherCertificate: {
          description: 'Entry to Higher Certificate courses',
          requirements: [
            '40% in HL',
            '40% in 2 other subjects',
            '30% in 3 other subjects'
          ]
        },
        diplomaPass: {
          description: 'Entry to Diploma courses',
          requirements: [
            '40% in HL',
            '40% in 4 subjects',
            '30% in 2 subjects'
          ]
        },
        bachelorPass: {
          description: 'Entry to Bachelor degree programmes',
          requirements: [
            '40% in HL',
            '50% in 4 subjects',
            '30% in 2 subjects'
          ]
        }
      },
      achievementLevels: [
        { code: '7', descriptor: 'Outstanding achievement', percentage: '80-100' },
        { code: '6', descriptor: 'Meritorious achievement', percentage: '70-79' },
        { code: '5', descriptor: 'Substantial achievement', percentage: '60-69' },
        { code: '4', descriptor: 'Adequate achievement', percentage: '50-59' },
        { code: '3', descriptor: 'Moderate achievement', percentage: '40-49' },
        { code: '2', descriptor: 'Elementary achievement', percentage: '30-39' },
        { code: '1', descriptor: 'Not achieved', percentage: '0-29' }
      ]
    }
  }

  /**
   * Get all grades (public accessor)
   */
  getAllGrades(): Map<string, SecondaryGrade> {
    return this.grades
  }

  /**
   * Get all streams (public accessor)
   */
  getAllStreams(): Map<string, AcademicStream> {
    return this.streams
  }

  /**
   * Get student record (public accessor)
   */
  getStudentRecord(studentId: string): StudentRecord | undefined {
    return this.studentRecords.get(studentId)
  }
}

export interface SpecializedAgent {
  id: string
  role: string
  subjects: string[]
  qualifications: string[]
  experience: string
  teachingStyle: string[]
  elaraIntegrated: boolean
  capabilities: string[]
}

export interface StudentRecord {
  studentId: string
  gradeLevel: string
  stream?: string
  enrollmentDate: Date
  subjects: SubjectEnrollment[]
  academicAgents: string[]
  studyPlan: string
  nscTarget?: 'Higher Certificate' | 'Diploma Pass' | 'Bachelor Pass'
}

export interface SubjectEnrollment {
  subjectId: string
  startDate: Date
  currentMark: number
  sba: number // School Based Assessment
  examMark?: number
  finalMark?: number
  achievementLevel?: string
}

// Create singleton
export const secondaryEducation = new SecondaryEducationCore()

export default secondaryEducation
