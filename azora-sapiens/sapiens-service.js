/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

/**
 * AZORA SAPIENS - EDUCATION PLATFORM
 *
 * Universal education platform with home-first approach.
 * Features CKQ (Core Knowledge Qualification) programs and Aegis Mobile Sentry.
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const crypto = require('crypto');
const axios = require('axios');

class AzoraSapiens {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.clients = new Map();
        this.activeExams = new Map();
        this.enrollments = new Map();
        this.ckqPrograms = this.initializeCKQPrograms();
        this.academicKnowledgeGraph = new Map();
        this.mintServiceUrl = process.env.MINT_SERVICE_URL || 'http://localhost:4300';
    }

    initializeCKQPrograms() {
        return {
            'planetary-economic-intelligence': {
                id: 'planetary-economic-intelligence',
                title: 'Planetary Economic Intelligence',
                description: 'Master the fundamentals of planetary-scale economic systems',
                duration: '8 weeks',
                level: 'CKQ-3',
                modules: [
                    'Economic Systems Fundamentals',
                    'Planetary Resource Allocation',
                    'Market Dynamics & Prediction',
                    'Sovereign Currency Design',
                    'Innovation Capstone: Planetary Economic Modeling'
                ],
                assessment: {
                    type: 'comprehensive_exam',
                    duration: 180,
                    requiresAegis: true
                },
                enrollmentFee: 0,
                status: 'live',
                instructor: 'Dr. Azora Prime'
            },
            'aegis-integrity-systems': {
                id: 'aegis-integrity-systems',
                title: 'Aegis Integrity Systems',
                description: 'Learn to build and maintain incorruptible systems',
                duration: '6 weeks',
                level: 'CKQ-2',
                modules: [
                    'Integrity Fundamentals',
                    'Blockchain Security Principles',
                    'Cryptographic Sovereignty',
                    'Mobile Sentry Architecture',
                    'Innovation Capstone: Aegis Citadel Design'
                ],
                assessment: {
                    type: 'practical_exam',
                    duration: 150,
                    requiresAegis: true
                },
                enrollmentFee: 0,
                status: 'live',
                instructor: 'Guardian Protocol'
            },
            'constitutional-economics': {
                id: 'constitutional-economics',
                title: 'Constitutional Economics',
                description: 'Building economies on mathematical and ethical foundations',
                duration: '7 weeks',
                level: 'CKQ-3',
                modules: [
                    'Economic Constitution Design',
                    'Mathematical Incentive Structures',
                    'Ethical Economic Frameworks',
                    'Constitutional AI Constraints',
                    'Innovation Capstone: Sovereign Economy Constitution'
                ],
                assessment: {
                    type: 'design_exam',
                    duration: 210,
                    requiresAegis: true
                },
                enrollmentFee: 0,
                status: 'live',
                instructor: 'Economic Architect'
            },
            'ai-economic-agents': {
                id: 'ai-economic-agents',
                title: 'AI Economic Agents',
                description: 'Programming autonomous economic intelligence',
                duration: '9 weeks',
                level: 'CKQ-4',
                modules: [
                    'AI Agent Fundamentals',
                    'Economic Decision Algorithms',
                    'Autonomous Trading Systems',
                    'Multi-Agent Coordination',
                    'Innovation Capstone: Planetary Economic AI Network'
                ],
                assessment: {
                    type: 'code_audit_exam',
                    duration: 240,
                    requiresAegis: true
                },
                enrollmentFee: 0,
                status: 'live',
                instructor: 'AI Architect'
            }
        };
    }

    initialize() {
        this.app.use(express.json());

        // WebSocket connection handling for Aegis Mobile Sentry
        this.wss.on('connection', (ws, req) => {
            const clientId = this.extractClientId(req.url);
            if (clientId) {
                this.clients.set(clientId, ws);
                console.log(`📚 Sapiens: Aegis client ${clientId} connected`);

                ws.on('close', () => {
                    this.clients.delete(clientId);
                    console.log(`📚 Sapiens: Aegis client ${clientId} disconnected`);
                });

                ws.on('message', (message) => {
                    try {
                        const data = JSON.parse(message.toString());
                        this.handleAegisMessage(clientId, data);
                    } catch (error) {
                        console.error('Invalid Aegis message format:', error);
                    }
                });
            }
        });

        // REST API Routes
        this.app.get('/api/programs', (req, res) => {
            res.json({
                programs: Object.values(this.ckqPrograms),
                total: Object.keys(this.ckqPrograms).length,
                status: 'live'
            });
        });

        // New endpoint for UI course catalog
        this.app.get('/api/courses', (req, res) => {
            const courses = Object.values(this.ckqPrograms).map(program => ({
                id: program.id,
                title: program.title,
                description: program.description,
                level: program.level,
                duration: program.duration,
                enrolled: Math.floor(Math.random() * 1000) + 100, // Mock enrollment numbers
                rating: (Math.random() * 0.5 + 4.5).toFixed(1), // 4.5-5.0 rating
                instructor: program.instructor,
                modules: program.modules,
                assessment: program.assessment
            }));

            res.json({
                courses,
                total: courses.length,
                status: 'live'
            });
        });

        // Get specific course details
        this.app.get('/api/courses/:courseId', (req, res) => {
            const courseId = req.params.courseId;
            const program = this.ckqPrograms[courseId];

            if (!program) {
                return res.status(404).json({ error: 'Course not found' });
            }

            res.json({
                course: {
                    id: program.id,
                    title: program.title,
                    description: program.description,
                    level: program.level,
                    duration: program.duration,
                    enrolled: Math.floor(Math.random() * 1000) + 100,
                    rating: (Math.random() * 0.5 + 4.5).toFixed(1),
                    instructor: program.instructor,
                    modules: program.modules,
                    assessment: program.assessment,
                    status: program.status
                }
            });
        });

        this.app.post('/api/enroll', (req, res) => {
            const { userId, programId, courseId } = req.body;
            const programIdentifier = programId || courseId;

            if (!userId || !programIdentifier) {
                return res.status(400).json({ error: 'Missing userId or programId/courseId' });
            }

            if (!this.ckqPrograms[programIdentifier]) {
                return res.status(404).json({ error: 'Program not found' });
            }

            const enrollment = {
                id: crypto.randomUUID(),
                userId,
                programId: programIdentifier,
                enrolledAt: new Date().toISOString(),
                status: 'active',
                progress: {
                    completedModules: [],
                    currentModule: this.ckqPrograms[programIdentifier].modules[0],
                    overallProgress: 0
                }
            };

            if (!this.enrollments.has(userId)) {
                this.enrollments.set(userId, []);
            }
            this.enrollments.get(userId).push(enrollment);

            res.json({
                enrollment,
                message: 'Successfully enrolled in CKQ program',
                nextSteps: [
                    'Begin theoretical modules',
                    'Complete practice assessments',
                    'Schedule final Aegis-protected exam'
                ]
            });
        });

        this.app.get('/api/enrollments/:userId', (req, res) => {
            const userId = req.params.userId;
            const userEnrollments = this.enrollments.get(userId) || [];

            // Transform enrollments to match UI expectations
            const transformedEnrollments = userEnrollments.map(enrollment => ({
                id: enrollment.id,
                userId: enrollment.userId,
                courseId: enrollment.programId,
                courseTitle: this.ckqPrograms[enrollment.programId]?.title,
                enrolledAt: enrollment.enrolledAt,
                status: enrollment.status,
                progress: enrollment.progress
            }));

            res.json({ enrollments: transformedEnrollments });
        });

        // Get user learning stats
        this.app.get('/api/users/:userId/stats', (req, res) => {
            const userId = req.params.userId;
            const userEnrollments = this.enrollments.get(userId) || [];

            // Calculate stats
            const coursesEnrolled = userEnrollments.length;
            const coursesInProgress = userEnrollments.filter(e => e.status === 'active').length;
            const coursesCompleted = userEnrollments.filter(e => e.status === 'completed').length;

            // Mock knowledge points (would be calculated from actual rewards)
            const knowledgePoints = Math.floor(Math.random() * 1000) + 500;

            // Mock streak
            const currentStreak = Math.floor(Math.random() * 15) + 1;

            res.json({
                userId,
                stats: {
                    coursesEnrolled,
                    coursesInProgress,
                    coursesCompleted,
                    knowledgePoints,
                    currentStreak,
                    assessmentsPassed: Math.floor(coursesCompleted * 2.5), // Mock
                    successRate: 95 // Mock
                }
            });
        });

        // Get user rewards history
        this.app.get('/api/users/:userId/rewards', (req, res) => {
            const userId = req.params.userId;

            // Mock rewards history
            const rewards = [
                { activity: "Completed 'Economic Theory' assessment", points: 150, date: "2 days ago", type: "assessment" },
                { activity: "7-day learning streak bonus", points: 100, date: "3 days ago", type: "streak" },
                { activity: "Enrolled in 'Blockchain Sovereignty'", points: 50, date: "5 days ago", type: "enrollment" },
                { activity: "Perfect score bonus", points: 250, date: "1 week ago", type: "bonus" },
                { activity: "Weekly progress milestone", points: 75, date: "1 week ago", type: "milestone" }
            ];

            res.json({ rewards });
        });

        // Get user progress details
        this.app.get('/api/users/:userId/progress', (req, res) => {
            const userId = req.params.userId;

            // Mock progress data
            const progress = [
                { subject: "Economic Theory", progress: 85, assessments: 12, passed: 11 },
                { subject: "Blockchain Technology", progress: 72, assessments: 8, passed: 7 },
                { subject: "AI Ethics", progress: 91, assessments: 15, passed: 15 },
                { subject: "System Architecture", progress: 68, assessments: 10, passed: 8 }
            ];

            res.json({ progress });
        });

        // Enroll in a course
        this.app.post('/api/enroll', (req, res) => {
            const { userId, courseId } = req.body;

            if (!userId || !courseId) {
                return res.status(400).json({ error: 'userId and courseId are required' });
            }

            if (!this.ckqPrograms[courseId]) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Check if already enrolled
            const userEnrollments = this.enrollments.get(userId) || [];
            const existingEnrollment = userEnrollments.find(e => e.programId === courseId);

            if (existingEnrollment) {
                return res.status(409).json({ error: 'Already enrolled in this course' });
            }

            // Create enrollment
            const enrollment = {
                id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                programId: courseId,
                enrolledAt: new Date().toISOString(),
                status: 'active',
                progress: 0,
                completedModules: [],
                currentModule: 0
            };

            userEnrollments.push(enrollment);
            this.enrollments.set(userId, userEnrollments);

            res.json({
                success: true,
                enrollment,
                message: 'Successfully enrolled in course'
            });
        });

        // Aegis Mobile Sentry endpoints
        this.app.post('/api/aegis/start-exam', (req, res) => {
            const { userId, courseId, assessmentId } = req.body;

            if (!userId || !courseId || !assessmentId) {
                return res.status(400).json({ error: 'userId, courseId, and assessmentId are required' });
            }

            // Start Aegis monitoring session
            const sessionId = `aegis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const session = {
                id: sessionId,
                userId,
                courseId,
                assessmentId,
                startTime: new Date().toISOString(),
                status: 'active',
                integrityScore: 100,
                alerts: []
            };

            this.activeExams.set(sessionId, session);

            res.json({
                success: true,
                sessionId,
                message: 'Aegis Mobile Sentry activated for exam integrity monitoring'
            });
        });

        this.app.post('/api/aegis/heartbeat', (req, res) => {
            const { sessionId, deviceData } = req.body;

            if (!sessionId) {
                return res.status(400).json({ error: 'sessionId is required' });
            }

            const session = this.activeExams.get(sessionId);
            if (!session) {
                return res.status(404).json({ error: 'Exam session not found' });
            }

            // Process device data for integrity monitoring
            // In a real implementation, this would analyze device data for suspicious activity
            const integrityScore = Math.max(0, session.integrityScore - Math.random() * 5);

            session.integrityScore = integrityScore;
            session.lastHeartbeat = new Date().toISOString();

            // Generate alerts if integrity score drops too low
            if (integrityScore < 70 && !session.alerts.some(a => a.type === 'integrity_warning')) {
                session.alerts.push({
                    type: 'integrity_warning',
                    message: 'Potential integrity compromise detected',
                    timestamp: new Date().toISOString(),
                    severity: 'medium'
                });
            }

            res.json({
                success: true,
                integrityScore: Math.round(integrityScore),
                status: session.status,
                alerts: session.alerts
            });
        });

        this.app.post('/api/aegis/end-exam', (req, res) => {
            const { sessionId } = req.body;

            if (!sessionId) {
                return res.status(400).json({ error: 'sessionId is required' });
            }

            const session = this.activeExams.get(sessionId);
            if (!session) {
                return res.status(404).json({ error: 'Exam session not found' });
            }

            session.status = 'completed';
            session.endTime = new Date().toISOString();

            // Final integrity assessment
            const finalScore = session.integrityScore;
            const passed = finalScore >= 80; // 80% integrity threshold

            this.activeExams.delete(sessionId);

            res.json({
                success: true,
                finalIntegrityScore: Math.round(finalScore),
                passed,
                alerts: session.alerts,
                message: passed ? 'Exam completed with integrity verified' : 'Exam flagged for integrity review'
            });
        });

        // Get certifications
        this.app.get('/api/users/:userId/certifications', (req, res) => {
            const userId = req.params.userId;

            // Mock certifications based on completed courses
            const certifications = [
                {
                    id: 'cert_001',
                    title: 'Planetary Economic Intelligence',
                    issuedAt: '2024-01-15T10:00:00Z',
                    issuer: 'Azora Sapiens University',
                    credentialId: 'AZORA-CERT-2024-001',
                    blockchainVerified: true,
                    proofOfKnowledge: {
                        points: 1500,
                        level: 'Advanced',
                        specializations: ['Economic Theory', 'Planetary Systems']
                    }
                },
                {
                    id: 'cert_002',
                    title: 'Aegis Integrity Systems',
                    issuedAt: '2024-01-20T14:30:00Z',
                    issuer: 'Azora Sapiens University',
                    credentialId: 'AZORA-CERT-2024-002',
                    blockchainVerified: true,
                    proofOfKnowledge: {
                        points: 1200,
                        level: 'Intermediate',
                        specializations: ['Security Systems', 'Integrity Monitoring']
                    }
                }
            ];

            res.json({ certifications });
        });

        // Mint Proof-of-Knowledge reward
        this.app.post('/api/rewards/mint', (req, res) => {
            const { userId, achievementType, achievementData } = req.body;

            if (!userId || !achievementType) {
                return res.status(400).json({ error: 'userId and achievementType are required' });
            }

            // Calculate reward points based on achievement type
            let points = 0;
            let description = '';

            switch (achievementType) {
                case 'course_completion':
                    points = 500;
                    description = `Completed course: ${achievementData.courseTitle}`;
                    break;
                case 'assessment_passed':
                    points = 150;
                    description = `Passed assessment: ${achievementData.assessmentTitle}`;
                    break;
                case 'perfect_score':
                    points = 250;
                    description = `Perfect score on: ${achievementData.assessmentTitle}`;
                    break;
                case 'learning_streak':
                    points = achievementData.days * 10;
                    description = `${achievementData.days}-day learning streak`;
                    break;
                default:
                    points = 50;
                    description = 'General achievement';
            }

            // In a real implementation, this would interact with Azora Mint service
            // For now, we'll simulate the reward minting
            const reward = {
                id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                type: 'proof_of_knowledge',
                points,
                description,
                mintedAt: new Date().toISOString(),
                transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
                blockchainVerified: true
            };

            res.json({
                success: true,
                reward,
                message: `Successfully minted ${points} Proof-of-Knowledge points`
            });
        });

        // Get reward balance
        this.app.get('/api/users/:userId/rewards/balance', (req, res) => {
            const userId = req.params.userId;

            // Mock balance - in real implementation, this would query Azora Mint
            const balance = {
                totalPoints: 2450,
                availablePoints: 2200,
                lockedPoints: 250,
                level: 'Advanced Scholar',
                nextLevelThreshold: 3000,
                recentTransactions: [
                    { type: 'earned', points: 500, description: 'Course completion', date: '2 days ago' },
                    { type: 'spent', points: 100, description: 'Premium content access', date: '1 week ago' },
                    { type: 'earned', points: 150, description: 'Assessment passed', date: '1 week ago' }
                ]
            };

            res.json({ balance });
        });

        // Get Ascension Protocol status
        this.app.get('/api/users/:userId/ascension', (req, res) => {
            const userId = req.params.userId;

            const ascensionStatus = {
                currentLevel: 'Scholar',
                progressToNext: 68, // 68% towards next level
                totalKnowledgePoints: 2450,
                nextLevelThreshold: 3000,
                specializations: [
                    { name: 'Economic Theory', level: 'Advanced', progress: 85 },
                    { name: 'AI Ethics', level: 'Intermediate', progress: 72 },
                    { name: 'Blockchain Sovereignty', level: 'Beginner', progress: 45 }
                ],
                achievements: [
                    'First Course Completed',
                    'Perfect Assessment Score',
                    '7-Day Learning Streak',
                    'Economic Theory Mastery'
                ],
                nextMilestone: 'Advanced Scholar (3000 points)'
            };

            res.json({ ascensionStatus });
        });

        this.app.post('/api/exam/start', (req, res) => {
            const { userId, programId } = req.body;

            if (!userId || !programId) {
                return res.status(400).json({ error: 'Missing userId or programId' });
            }

            // Generate unique exam session
            const examSession = {
                id: crypto.randomUUID(),
                userId,
                programId,
                startTime: new Date().toISOString(),
                status: 'initializing',
                qrCode: this.generateExamQR(userId, programId),
                aegisStatus: 'pending'
            };

            this.activeExams.set(examSession.id, examSession);

            res.json({
                examSession,
                instructions: [
                    'Ensure you have the Aegis Sentry app installed on your smartphone',
                    'Place your phone on a stable surface facing you and your workspace',
                    'Scan the QR code with the Aegis app to begin monitoring',
                    'Do not leave your seat or use unauthorized materials'
                ]
            });
        });

        this.app.post('/api/exam/aegis-auth', (req, res) => {
            const { examId, deviceFingerprint } = req.body;

            const exam = this.activeExams.get(examId);
            if (!exam) {
                return res.status(404).json({ error: 'Exam session not found' });
            }

            // Simulate Aegis authentication
            exam.aegisStatus = 'authenticated';
            exam.deviceFingerprint = deviceFingerprint;
            exam.authTime = new Date().toISOString();

            // Notify connected Aegis client
            const aegisClient = this.clients.get(exam.userId);
            if (aegisClient) {
                aegisClient.send(JSON.stringify({
                    type: 'exam_start',
                    examId,
                    action: 'lock_device',
                    requirements: {
                        camera: true,
                        microphone: true,
                        lockdown: true
                    }
                }));
            }

            res.json({
                status: 'authenticated',
                examId,
                message: 'Aegis Mobile Sentry activated. Exam monitoring begins now.'
            });
        });

        this.app.post('/api/module/complete', (req, res) => {
            const { userId, programId, moduleName, assessmentScore } = req.body;

            if (!userId || !programId || !moduleName) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Trigger Proof-of-Knowledge reward
            this.rewardModuleCompletion(userId, programId, moduleName, assessmentScore)
                .then(rewardResult => {
                    res.json({
                        success: true,
                        module: moduleName,
                        reward: rewardResult?.mainReward,
                        milestoneRewards: rewardResult?.milestoneRewards,
                        progress: rewardResult?.progress,
                        message: 'Module completed successfully!'
                    });
                })
                .catch(error => {
                    console.error('Error processing module completion:', error);
                    res.status(500).json({ error: 'Failed to process module completion' });
                });
        });

        this.app.post('/api/exam/submit', (req, res) => {
            const { examId, answers } = req.body;

            const exam = this.activeExams.get(examId);
            if (!exam) {
                return res.status(404).json({ error: 'Exam session not found' });
            }

            // Simulate grading (in production, this would be more sophisticated)
            const score = Math.floor(Math.random() * 40) + 60; // 60-100
            const passed = score >= 70;

            exam.status = 'completed';
            exam.submissionTime = new Date().toISOString();
            exam.score = score;
            exam.passed = passed;

            // Trigger Proof-of-Knowledge reward for assessment pass
            if (passed) {
                this.rewardAssessmentPass(exam.userId, exam.programId, this.ckqPrograms[exam.programId].assessment.type, score);
                // Also trigger certificate achievement reward
                this.rewardCertificateAchievement(exam.userId, exam.programId, 'ckq_basic');
            }

            // Release Aegis lockdown
            const aegisClient = this.clients.get(exam.userId);
            if (aegisClient) {
                aegisClient.send(JSON.stringify({
                    type: 'exam_complete',
                    examId,
                    result: passed ? 'passed' : 'failed',
                    score,
                    action: 'unlock_device'
                }));
            }

            res.json({
                examId,
                score,
                passed,
                certificate: passed ? this.generateCertificate(exam) : null,
                message: passed ?
                    'Congratulations! You have earned your CKQ certification.' :
                    'Exam not passed. You may retake the assessment after additional study.'
            });
        });

        // Academic Knowledge Graph endpoints (for Ascension Protocol)
        this.app.get('/api/knowledge-graph/status', (req, res) => {
            res.json({
                ingestionProgress: {
                    universities: ['MIT', 'Stanford', 'Oxford', 'Harvard', 'Cambridge'],
                    faculties: ['Engineering', 'Medicine', 'Law', 'Economics', 'Computer Science'],
                    completion: 23, // percentage
                    documentsProcessed: 15420,
                    knowledgeNodes: 89234
                },
                deconstructionProgress: {
                    economics: 7,
                    engineering: 12,
                    medicine: 5,
                    law: 3
                },
                synthesisProgress: {
                    ckqAdvancedLaw: 45,
                    ckqAdvancedEngineering: 23,
                    ckqAdvancedMedicine: 18
                }
            });
        });

        this.app.get('/api/knowledge-graph/search', (req, res) => {
            const { query, faculty } = req.query;
            // Simulate knowledge graph search
            res.json({
                query,
                faculty,
                results: [
                    {
                        id: 'kg_001',
                        title: 'First Principles Analysis of Economic Theory',
                        source: 'MIT Economics Department',
                        relevance: 0.95,
                        insights: [
                            'Phillips Curve model contains logical inconsistencies',
                            'Modern monetary theory requires revision',
                            'Austrian economics provides superior framework'
                        ]
                    }
                ]
            });
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                service: 'Azora Sapiens',
                status: 'operational',
                features: {
                    ckqPrograms: Object.keys(this.ckqPrograms).length,
                    activeExams: this.activeExams.size,
                    enrolledStudents: this.enrollments.size,
                    aegisClients: this.clients.size
                },
                proofOfKnowledge: {
                    protocol: 'active',
                    mintService: this.mintServiceUrl,
                    rewardsEnabled: true
                },
                ascensionProtocol: {
                    knowledgeIngestion: 'active',
                    firstPrinciplesDeconstruction: 'active',
                    curriculumSynthesis: 'active'
                }
            });
        });
    }

    extractClientId(url) {
        const urlObj = new URL(url, 'http://localhost');
        return urlObj.searchParams.get('userId');
    }

    handleAegisMessage(clientId, data) {
        console.log(`📱 Aegis: Message from ${clientId}:`, data.type);

        switch (data.type) {
            case 'device_locked':
                // Device successfully locked for exam
                const exam = Array.from(this.activeExams.values())
                    .find(e => e.userId === clientId && e.aegisStatus === 'authenticated');
                if (exam) {
                    exam.status = 'active';
                    console.log(`📚 Exam ${exam.id} now active with Aegis protection`);
                }
                break;

            case 'anomaly_detected':
                // Handle security violations
                this.handleSecurityViolation(clientId, data.anomaly);
                break;

            case 'exam_complete':
                // Exam finished on mobile side
                console.log(`📱 Aegis: Exam completed for ${clientId}`);
                break;
        }
    }

    handleSecurityViolation(clientId, anomaly) {
        console.warn(`🚨 Security violation detected for ${clientId}:`, anomaly);

        // Find active exam and terminate it
        const exam = Array.from(this.activeExams.values())
            .find(e => e.userId === clientId && e.status === 'active');

        if (exam) {
            exam.status = 'terminated';
            exam.violation = anomaly;

            // Notify computer client
            // In production, this would send WebSocket message to exam interface
            console.log(`❌ Exam ${exam.id} terminated due to security violation`);
        }
    }

    generateExamQR(userId, programId) {
        const payload = {
            userId,
            programId,
            timestamp: Date.now(),
            sessionId: crypto.randomUUID()
        };

        // In production, this would be encrypted
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }

    generateCertificate(exam) {
        return {
            id: crypto.randomUUID(),
            type: 'CKQ',
            program: this.ckqPrograms[exam.programId].title,
            recipient: exam.userId,
            issueDate: new Date().toISOString(),
            expiryDate: null, // CKQ never expires
            verificationUrl: `https://azora.es/verify/${crypto.randomUUID()}`,
            blockchainHash: crypto.createHash('sha256')
                .update(JSON.stringify(exam))
                .digest('hex')
        };
    }

    // Proof-of-Knowledge Protocol: Reward Methods
    async triggerKnowledgeReward(userId, rewardType, rewardCategory, achievement, programId = null, moduleName = null) {
        try {
            console.log(`🎓 Proof-of-Knowledge: Triggering reward for ${userId} - ${achievement}`);

            const rewardResponse = await axios.post(`${this.mintServiceUrl}/api/knowledge-reward`, {
                userId,
                rewardType,
                rewardCategory,
                achievement,
                programId,
                moduleName
            });

            if (rewardResponse.data.success) {
                console.log(`💰 Reward paid: ${rewardResponse.data.reward.amount} aZAR to ${userId}`);

                // Notify the user via WebSocket if connected
                const userClient = this.clients.get(userId);
                if (userClient) {
                    userClient.send(JSON.stringify({
                        type: 'knowledge_reward',
                        reward: rewardResponse.data.reward,
                        message: rewardResponse.data.message,
                        nextMilestones: rewardResponse.data.nextMilestones
                    }));
                }

                return rewardResponse.data;
            } else {
                console.error(`❌ Reward failed for ${userId}:`, rewardResponse.data.error);
                return null;
            }

        } catch (error) {
            console.error(`❌ Error triggering knowledge reward for ${userId}:`, error.message);
            return null;
        }
    }

    async rewardModuleCompletion(userId, programId, moduleName, assessmentScore = null) {
        const enrollment = this.getUserEnrollment(userId, programId);
        if (!enrollment) return null;

        // Determine reward category based on module difficulty/assessment
        let rewardCategory = 'basic';
        if (assessmentScore && assessmentScore >= 80) {
            rewardCategory = 'advanced';
        } else if (assessmentScore && assessmentScore >= 70) {
            rewardCategory = 'intermediate';
        }

        const achievement = `Completed module: ${moduleName}${assessmentScore ? ` (${assessmentScore}%)` : ''}`;

        // Update enrollment progress
        enrollment.progress.completedModules.push(moduleName);
        enrollment.progress.overallProgress = (enrollment.progress.completedModules.length /
            this.ckqPrograms[programId].modules.length) * 100;

        // Check for milestone bonuses
        const milestoneRewards = [];

        if (enrollment.progress.completedModules.length === 1) {
            // First module bonus
            milestoneRewards.push(
                this.triggerKnowledgeReward(userId, 'milestone_bonus', 'first_module',
                    'First module completed!', programId, moduleName)
            );
        }

        if (enrollment.progress.overallProgress >= 50 && !enrollment.progress.halfwayBonusClaimed) {
            // Halfway point bonus
            milestoneRewards.push(
                this.triggerKnowledgeReward(userId, 'milestone_bonus', 'halfway_point',
                    'Halfway through CKQ program!', programId)
            );
            enrollment.progress.halfwayBonusClaimed = true;
        }

        // Main module completion reward
        const mainReward = await this.triggerKnowledgeReward(userId, 'module_completion', rewardCategory,
            achievement, programId, moduleName);

        // Wait for milestone rewards
        await Promise.all(milestoneRewards);

        return {
            mainReward,
            milestoneRewards: await Promise.all(milestoneRewards),
            progress: enrollment.progress
        };
    }

    async rewardAssessmentPass(userId, programId, assessmentType, score) {
        const achievement = `Passed ${assessmentType} assessment with ${score}%`;

        let rewardCategory;
        switch (assessmentType) {
            case 'practical_exam':
                rewardCategory = 'practical_exam';
                break;
            case 'code_audit_exam':
                rewardCategory = 'code_audit';
                break;
            case 'capstone_project':
                rewardCategory = 'capstone_project';
                break;
            default:
                rewardCategory = 'practical_exam';
        }

        return await this.triggerKnowledgeReward(userId, 'assessment_pass', rewardCategory,
            achievement, programId);
    }

    async rewardCertificateAchievement(userId, programId, certificateType = 'ckq_basic') {
        const program = this.ckqPrograms[programId];
        const achievement = `Earned ${program.title} certification`;

        return await this.triggerKnowledgeReward(userId, 'certificate_achievement', certificateType,
            achievement, programId);
    }

    getUserEnrollment(userId, programId) {
        const userEnrollments = this.enrollments.get(userId) || [];
        return userEnrollments.find(e => e.programId === programId);
    }

    start(port = 4200) {
        this.server.listen(port, () => {
            console.log(`📚 Azora Sapiens Education Platform running on port ${port}`);
            console.log(`   🌐 WebSocket: ws://localhost:${port}`);
            console.log(`   📖 Programs: http://localhost:${port}/api/programs`);
            console.log(`   🎓 Enrollment: http://localhost:${port}/api/enroll`);
            console.log(`   🛡️  Aegis: Mobile sentry protocol active`);
            console.log(`   📊 Health: http://localhost:${port}/health`);
        });
    }

    stop() {
        this.wss.close();
        this.server.close();
    }
}

// Create and export singleton instance
const azoraSapiens = new AzoraSapiens();

// Initialize the service
azoraSapiens.initialize();

// Start the service
azoraSapiens.start();

module.exports = azoraSapiens;