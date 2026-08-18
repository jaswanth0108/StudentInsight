import { PrismaClient, UserRole, QuestionType, AssessmentStatus, ResponseStatus, SessionStatus, SupportLevel, FollowUpStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with demo data...')

  // 1. Clean existing data in reverse order of relationships
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.followUpTask.deleteMany()
  await prisma.counselingNote.deleteMany()
  await prisma.counselingSession.deleteMany()
  await prisma.categoryScore.deleteMany()
  await prisma.responseAnswer.deleteMany()
  await prisma.assessmentResponse.deleteMany()
  await prisma.questionOption.deleteMany()
  await prisma.assessmentQuestion.deleteMany()
  await prisma.assessmentVersion.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.questionCategory.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.student.deleteMany()
  await prisma.counselor.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.authSession.deleteMany()
  await prisma.class.deleteMany()
  await prisma.department.deleteMany()
  await prisma.institution.deleteMany()
  await prisma.user.deleteMany()

  console.log('Cleared existing data.')

  // 2. Create Institution
  const institution = await prisma.institution.create({
    data: {
      name: 'Nexus Institute of Technology & Sciences',
      code: 'NITS',
      description: 'A premier educational institution dedicated to academic excellence and student well-being.',
    },
  })

  // 3. Create Departments
  const deptCSE = await prisma.department.create({
    data: {
      institutionId: institution.id,
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Department of Computer Science and Engineering',
    },
  })

  const deptPsych = await prisma.department.create({
    data: {
      institutionId: institution.id,
      name: 'Psychology & Behavioral Sciences',
      code: 'PSYCH',
      description: 'Department of Psychological Sciences',
    },
  })

  // 4. Create Classes
  const classCSE2 = await prisma.class.create({
    data: {
      departmentId: deptCSE.id,
      name: 'B.Tech CSE - 2nd Year',
      year: 2,
      section: 'A',
      academicYear: '2025-2026',
    },
  })

  const classCSE3 = await prisma.class.create({
    data: {
      departmentId: deptCSE.id,
      name: 'B.Tech CSE - 3rd Year',
      year: 3,
      section: 'B',
      academicYear: '2025-2026',
    },
  })

  // 5. Create Question Categories
  const categoriesData = [
    { key: 'empathy', name: 'Empathy', color: '#6366f1', description: 'Ability to understand and share the feelings of others' },
    { key: 'humanity', name: 'Humanity', color: '#ec4899', description: 'Compassion and care for others well-being' },
    { key: 'socialInteraction', name: 'Social Interaction', color: '#14b8a6', description: 'Comfort and skill in social situations' },
    { key: 'introversion', name: 'Introversion', color: '#8b5cf6', description: 'Preference for quiet, reflective environments' },
    { key: 'extroversion', name: 'Extroversion', color: '#f59e0b', description: 'Energy gained from social interactions' },
    { key: 'communication', name: 'Communication', color: '#3b82f6', description: 'Effectiveness in expressing thoughts and active listening' },
    { key: 'confidence', name: 'Confidence', color: '#0ea5e9', description: 'Self-assurance in one’s abilities and decisions' },
    { key: 'stress', name: 'Stress Level', color: '#ef4444', description: 'Overall perceived stress and workload burden' },
    { key: 'academicPressure', name: 'Academic Pressure', color: '#f97316', description: 'Perceived stress specifically related to coursework and deadlines' },
    { key: 'emotionalWellbeing', name: 'Emotional Well-Being', color: '#a855f7', description: 'Emotional regulation, balance, and outlook' },
    { key: 'motivation', name: 'Motivation', color: '#22c55e', description: 'Drive, initiative, and enthusiasm toward academic goals' },
    { key: 'discipline', name: 'Self-Discipline', color: '#16a34a', description: 'Ability to stay organized and resist procrastination' },
    { key: 'resilience', name: 'Resilience', color: '#0891b2', description: 'Capacity to recover quickly from difficulties' },
    { key: 'adaptability', name: 'Adaptability', color: '#7c3aed', description: 'Flexibility in adjusting to new environments and challenges' },
    { key: 'leadership', name: 'Leadership', color: '#b45309', description: 'Tendency to guide, organize, and support peers' },
    { key: 'cooperation', name: 'Cooperation', color: '#0d9488', description: 'Willingness to work constructively in teams' },
    { key: 'behavioralTendencies', name: 'Behavioral Tendencies', color: '#64748b', description: 'General patterns of habit and daily conduct' },
    { key: 'socialSupport', name: 'Social Support', color: '#db2777', description: 'Perceived availability of helpful peer and mentor connections' },
    { key: 'selfAwareness', name: 'Self-Awareness', color: '#9333ea', description: 'Conscious knowledge of one’s own character, feelings, and motives' },
    { key: 'generalWellbeing', name: 'General Well-Being', color: '#2dd4bf', description: 'Overall sense of life satisfaction and balance' },
  ]

  const categories: Record<string, any> = {}
  for (const cat of categoriesData) {
    const created = await prisma.questionCategory.create({
      data: cat,
    })
    categories[cat.key] = created
  }

  // 6. Create Default Users (Admin, Counselor, Students)
  const passwordHash = await bcrypt.hash('Password@123', 10)

  // Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash,
      role: UserRole.ADMIN,
      name: 'Dean Eleanor Vance',
      admin: {
        create: {
          permissions: 'ALL_MANAGE,EXPORT_REPORTS,MANAGE_ASSESSMENTS,VIEW_AUDIT_LOGS',
        },
      },
    },
  })

  // Counselor 1
  const counselorUser1 = await prisma.user.create({
    data: {
      email: 'counselor@example.com',
      passwordHash,
      role: UserRole.COUNSELOR,
      name: 'Dr. Marcus Holloway',
      counselor: {
        create: {
          staffId: 'CNS-101',
          institutionId: institution.id,
          specialization: 'Student Well-Being & Academic Stress',
          phoneNumber: '+1-555-0192',
        },
      },
    },
    include: { counselor: true },
  })

  // Counselor 2
  const counselorUser2 = await prisma.user.create({
    data: {
      email: 'dr.sarah@example.com',
      passwordHash,
      role: UserRole.COUNSELOR,
      name: 'Dr. Sarah Jenkins',
      counselor: {
        create: {
          staffId: 'CNS-102',
          institutionId: institution.id,
          specialization: 'Career Transition & Emotional Awareness',
          phoneNumber: '+1-555-0193',
        },
      },
    },
    include: { counselor: true },
  })

  // Student 1: John Doe (STU-1024) - High empathy, elevated stress, improving trend
  const studentUser1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      name: 'John Doe',
      student: {
        create: {
          studentId: 'STU-1024',
          departmentId: deptCSE.id,
          classId: classCSE2.id,
          counselorId: counselorUser1.counselor!.id,
          gender: 'Male',
          supportLevel: SupportLevel.FOLLOW_UP_RECOMMENDED,
        },
      },
    },
    include: { student: true },
  })

  // Student 2: Emily Smith (STU-1025) - High confidence, high leadership, stable
  const studentUser2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      name: 'Emily Smith',
      student: {
        create: {
          studentId: 'STU-1025',
          departmentId: deptCSE.id,
          classId: classCSE3.id,
          counselorId: counselorUser1.counselor!.id,
          gender: 'Female',
          supportLevel: SupportLevel.STABLE,
        },
      },
    },
    include: { student: true },
  })

  // Student 3: Alex Kumar (STU-1026) - Introverted, creative, moderate support
  const studentUser3 = await prisma.user.create({
    data: {
      email: 'student3@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      name: 'Alex Kumar',
      student: {
        create: {
          studentId: 'STU-1026',
          departmentId: deptPsych.id,
          counselorId: counselorUser2.counselor!.id,
          gender: 'Non-binary',
          supportLevel: SupportLevel.MODERATE_SUPPORT,
        },
      },
    },
    include: { student: true },
  })

  console.log('Created Users: Admin, Counselors, and Students.')

  // 7. Create Primary Assessment
  const assessment = await prisma.assessment.create({
    data: {
      institutionId: institution.id,
      title: 'Student Personality & Well-Being Assessment (Standard)',
      description: 'A comprehensive, multi-dimensional assessment designed to evaluate personality tendencies, academic stress factors, and emotional well-being to provide personalized guidance and early counseling support.',
      instructions: 'Please answer each question thoughtfully and honestly. There are no right or wrong answers. Your responses are treated with strict confidentiality and used exclusively to support your academic journey and personal well-being.',
      version: 1,
      status: AssessmentStatus.PUBLISHED,
      timeLimit: 25,
      createdBy: adminUser.id,
      publishedAt: new Date(),
    },
  })

  // 8. Questions definition
  const questionsData = [
    // --- LIKERT SCALE QUESTIONS ---
    {
      text: 'I feel overwhelmed by my academic responsibilities and coursework deadlines.',
      type: QuestionType.LIKERT,
      categoryKey: 'academicPressure',
      weight: 1.5,
      isReversed: false, // Strongly Agree = 100% stress
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I can easily understand when a friend or classmate is feeling distressed or upset.',
      type: QuestionType.LIKERT,
      categoryKey: 'empathy',
      weight: 1.2,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I feel capable of managing unexpected difficulties and bouncing back from setbacks.',
      type: QuestionType.LIKERT,
      categoryKey: 'resilience',
      weight: 1.5,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I feel energized and inspired when working toward my academic and personal goals.',
      type: QuestionType.LIKERT,
      categoryKey: 'motivation',
      weight: 1.2,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I enjoy spending time in large social gatherings and meeting new groups of people.',
      type: QuestionType.LIKERT,
      categoryKey: 'extroversion',
      weight: 1.0,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I prefer quiet, independent environments where I can concentrate on my own thoughts.',
      type: QuestionType.LIKERT,
      categoryKey: 'introversion',
      weight: 1.0,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I feel confident expressing my ideas and speaking in front of peers or a seminar.',
      type: QuestionType.LIKERT,
      categoryKey: 'confidence',
      weight: 1.3,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I am able to maintain consistent study habits and manage time without procrastinating.',
      type: QuestionType.LIKERT,
      categoryKey: 'discipline',
      weight: 1.2,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I adapt smoothly when class schedules, syllabus expectations, or living arrangements change suddenly.',
      type: QuestionType.LIKERT,
      categoryKey: 'adaptability',
      weight: 1.1,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    {
      text: 'I naturally take the initiative to organize and support team members during group projects.',
      type: QuestionType.LIKERT,
      categoryKey: 'leadership',
      weight: 1.1,
      isReversed: false,
      options: [
        { text: '1 — Strongly Disagree', value: 0, order: 0 },
        { text: '2 — Disagree', value: 25, order: 1 },
        { text: '3 — Neutral', value: 50, order: 2 },
        { text: '4 — Agree', value: 75, order: 3 },
        { text: '5 — Strongly Agree', value: 100, order: 4 },
      ],
    },
    // --- MULTIPLE CHOICE QUESTIONS ---
    {
      text: 'How comfortable do you feel when reaching out to mentors or faculty for academic assistance?',
      type: QuestionType.MCQ,
      categoryKey: 'communication',
      weight: 1.2,
      isReversed: false,
      options: [
        { text: 'Very uncomfortable — I rarely or never ask', value: 10, order: 0 },
        { text: 'Somewhat hesitant — I only ask if in critical need', value: 40, order: 1 },
        { text: 'Neutral — neither easy nor difficult', value: 60, order: 2 },
        { text: 'Comfortable — I ask whenever appropriate', value: 85, order: 3 },
        { text: 'Very comfortable — I actively seek feedback and advice', value: 100, order: 4 },
      ],
    },
    {
      text: 'When faced with multiple challenging assignments in the same week, what best describes your primary emotional state?',
      type: QuestionType.MCQ,
      categoryKey: 'stress',
      weight: 1.5,
      isReversed: false,
      options: [
        { text: 'Calm and structured — I organize a plan and feel confident', value: 15, order: 0 },
        { text: 'Slightly tense, but manageable with standard effort', value: 35, order: 1 },
        { text: 'Noticeably stressed with disrupted sleep or focus', value: 70, order: 2 },
        { text: 'Significantly overwhelmed and struggling to cope', value: 95, order: 3 },
      ],
    },
    // --- YES / NO QUESTIONS ---
    {
      text: 'Do you currently feel you have at least one trusted friend, family member, or mentor you can confide in when stressed?',
      type: QuestionType.YES_NO,
      categoryKey: 'socialSupport',
      weight: 1.4,
      isReversed: false,
      options: [
        { text: 'Yes', value: 100, order: 0 },
        { text: 'No', value: 10, order: 1 },
      ],
    },
    {
      text: 'Do you frequently feel that your day-to-day workload exceeds your ability to manage it effectively?',
      type: QuestionType.YES_NO,
      categoryKey: 'stress',
      weight: 1.5,
      isReversed: false,
      options: [
        { text: 'Yes', value: 90, order: 0 },
        { text: 'No', value: 15, order: 1 },
      ],
    },
    // --- RATING SCALE (1-10) ---
    {
      text: 'On a scale from 1 (very low) to 10 (exceptionally high), rate your general sense of well-being and life satisfaction over the past two weeks.',
      type: QuestionType.RATING,
      categoryKey: 'generalWellbeing',
      weight: 1.8,
      isReversed: false,
      options: [],
    },
    {
      text: 'On a scale from 1 (very calm) to 10 (extremely pressured), rate your overall daily academic stress level right now.',
      type: QuestionType.RATING,
      categoryKey: 'stress',
      weight: 1.8,
      isReversed: false,
      options: [],
    },
    // --- OPEN-ENDED QUESTIONS ---
    {
      text: 'What is the biggest challenge or concern you are currently facing as a student, and how is it impacting your daily routine?',
      type: QuestionType.OPEN_ENDED,
      categoryKey: 'emotionalWellbeing',
      weight: 1.0,
      isReversed: false,
      options: [],
    },
    {
      text: 'What are your greatest personal strengths, and what kind of support from counselors or faculty would help you thrive most?',
      type: QuestionType.OPEN_ENDED,
      categoryKey: 'selfAwareness',
      weight: 1.0,
      isReversed: false,
      options: [],
    },
  ]

  const createdQuestions = []
  let orderIndex = 0
  for (const q of questionsData) {
    const category = categories[q.categoryKey]
    const createdQ = await prisma.assessmentQuestion.create({
      data: {
        assessmentId: assessment.id,
        categoryId: category?.id,
        text: q.text,
        type: q.type,
        weight: q.weight,
        isReversed: q.isReversed,
        order: orderIndex++,
        options: {
          create: q.options,
        },
      },
      include: { options: true },
    })
    createdQuestions.push(createdQ)
  }

  console.log(`Created Assessment with ${createdQuestions.length} questions across multiple dimensions.`)

  // 9. Pre-populate completed assessments and profile for Student 1 (John Doe)
  const student1Profile = await prisma.studentProfile.create({
    data: {
      studentId: studentUser1.student!.id,
      empathy: 84.0,
      humanity: 80.0,
      socialInteraction: 58.0,
      introversion: 72.0,
      extroversion: 30.0,
      communication: 67.0,
      confidence: 54.0,
      stress: 68.0,
      academicPressure: 74.0,
      emotionalWellbeing: 62.0,
      motivation: 70.0,
      discipline: 76.0,
      resilience: 52.0,
      adaptability: 71.0,
      leadership: 61.0,
      cooperation: 82.0,
      behavioralTendencies: 70.0,
      socialSupport: 75.0,
      selfAwareness: 78.0,
      generalWellbeing: 60.0,
      aiSummary: 'The assessment indicates a student who demonstrates high empathy and strong self-discipline. Elevated academic stress and workload pressure are notable indicators. Consider exploring workload management and stress mitigation strategies during counseling.',
      requiresFollowUp: true,
      flagReason: 'Assessment responses indicate elevated academic pressure and mild workload fatigue.',
    },
  })

  // Create Response for Student 1
  const response1 = await prisma.assessmentResponse.create({
    data: {
      assessmentId: assessment.id,
      studentId: studentUser1.student!.id,
      status: ResponseStatus.COMPLETED,
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      consentGiven: true,
      consentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      aiSummary: 'The student provided reflective answers emphasizing strong peer support and high dedication to studies, with notable concern regarding midterm examination load.',
      requiresFlag: true,
      flagReason: 'Assessment responses indicate elevated academic pressure.',
    },
  })

  // Populate Category Scores for Response 1
  const catScores1 = [
    { key: 'empathy', score: 84.0, label: 'Strong' },
    { key: 'stress', score: 68.0, label: 'Elevated' },
    { key: 'academicPressure', score: 74.0, label: 'Elevated' },
    { key: 'confidence', score: 54.0, label: 'Moderate' },
    { key: 'motivation', score: 70.0, label: 'Good' },
    { key: 'resilience', score: 52.0, label: 'Moderate' },
    { key: 'adaptability', score: 71.0, label: 'Good' },
    { key: 'discipline', score: 76.0, label: 'Strong' },
    { key: 'introversion', score: 72.0, label: 'Elevated' },
    { key: 'extroversion', score: 30.0, label: 'Moderate' },
    { key: 'communication', score: 67.0, label: 'Good' },
    { key: 'generalWellbeing', score: 60.0, label: 'Moderate' },
  ]

  for (const cs of catScores1) {
    await prisma.categoryScore.create({
      data: {
        responseId: response1.id,
        categoryKey: cs.key,
        score: cs.score,
        label: cs.label,
        questionCount: 2,
      },
    })
  }

  // Populate answers for response 1
  for (const q of createdQuestions) {
    if (q.type === QuestionType.LIKERT || q.type === QuestionType.MCQ || q.type === QuestionType.YES_NO) {
      const opt = q.options[q.options.length - 2] || q.options[0]
      await prisma.responseAnswer.create({
        data: {
          responseId: response1.id,
          questionId: q.id,
          optionId: opt?.id,
          normalizedScore: opt?.value,
        },
      })
    } else if (q.type === QuestionType.RATING) {
      await prisma.responseAnswer.create({
        data: {
          responseId: response1.id,
          questionId: q.id,
          numericValue: 7,
          normalizedScore: 66.7,
        },
      })
    } else if (q.type === QuestionType.OPEN_ENDED) {
      await prisma.responseAnswer.create({
        data: {
          responseId: response1.id,
          questionId: q.id,
          textValue: 'Balancing algorithmic assignments with preparation for internship drives has been quite stressful recently.',
        },
      })
    }
  }

  // 10. Create Counseling Session & Notes for Student 1
  const session1 = await prisma.counselingSession.create({
    data: {
      studentId: studentUser1.student!.id,
      counselorId: counselorUser1.counselor!.id,
      title: 'Initial Well-Being & Academic Stress Check-in',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      duration: 45,
      status: SessionStatus.SCHEDULED,
      location: 'Counseling Center - Room 204B',
      summary: 'Follow-up discussion on assessment results focusing on time management and study load optimization.',
    },
  })

  await prisma.counselingNote.create({
    data: {
      sessionId: session1.id,
      counselorId: counselorUser1.counselor!.id,
      studentId: studentUser1.student!.id,
      content: 'Student shows good self-awareness and active participation. Primary concern is exam preparation pacing. Recommended 25/5 Pomodoro sessions and weekend rest structure.',
      isPrivate: true,
      tags: 'academic_stress,time_management,goal_setting',
    },
  })

  await prisma.followUpTask.create({
    data: {
      studentId: studentUser1.student!.id,
      counselorId: counselorUser1.counselor!.id,
      title: 'Review 2-Week Study Timetable',
      description: 'Check in on how the modified study schedule is assisting with exam stress reduction.',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: FollowUpStatus.PENDING,
      priority: 2,
    },
  })

  // 11. Create Notifications
  await prisma.notification.create({
    data: {
      userId: studentUser1.id,
      type: 'COUNSELING_APPOINTMENT',
      title: 'Upcoming Counseling Session',
      message: 'You have a scheduled check-in session with Dr. Marcus Holloway in Room 204B.',
      link: '/student/counseling',
    },
  })

  await prisma.notification.create({
    data: {
      userId: counselorUser1.id,
      type: 'FOLLOW_UP_RECOMMENDED',
      title: 'Student Follow-up Recommended',
      message: 'John Doe (STU-1024) completed an assessment with elevated academic stress indicators.',
      link: `/counselor/students/${studentUser1.student!.id}`,
    },
  })

  // 12. Create Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'ASSESSMENT_PUBLISHED',
      resource: `assessment:${assessment.id}`,
      details: JSON.stringify({ title: assessment.title, version: 1 }),
    },
  })

  console.log('Database seeding successfully completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
