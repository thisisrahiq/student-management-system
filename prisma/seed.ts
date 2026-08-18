import { PrismaClient, EnrolmentStatus, GradeClassification } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // Clear existing records
  await prisma.result.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.student.deleteMany();
  await prisma.programme.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 1. Create Programmes
  const csProgramme = await prisma.programme.create({
    data: {
      code: 'BSC-CS',
      name: 'BSc (Hons) Computer Science',
      baseFee: 9250.00,
      duration: '3 Years Full-Time',
    },
  });

  const seProgramme = await prisma.programme.create({
    data: {
      code: 'MSC-SE',
      name: 'MSc Software Engineering',
      baseFee: 11500.00,
      duration: '1 Year Full-Time',
    },
  });

  console.log('✅ Created 2 Programmes.');

  // 2. Create Modules
  const webDevModule = await prisma.module.create({
    data: {
      code: 'CS101',
      title: 'Web Application Architecture & Next.js',
      programmeId: csProgramme.id,
    },
  });

  const dbModule = await prisma.module.create({
    data: {
      code: 'CS102',
      title: 'Relational Database Design & PostgreSQL',
      programmeId: csProgramme.id,
    },
  });

  const advSeModule = await prisma.module.create({
    data: {
      code: 'SE501',
      title: 'Advanced Software Architecture & Patterns',
      programmeId: seProgramme.id,
    },
  });

  console.log('✅ Created 3 Academic Modules.');

  // 3. Create Assessments
  const now = new Date();
  const futureDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in future
  const pastDeadline = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days in past

  const webAssessment = await prisma.assessment.create({
    data: {
      title: 'Full-Stack Registry System Project',
      moduleId: webDevModule.id,
      deadline: futureDeadline,
    },
  });

  const dbAssessment = await prisma.assessment.create({
    data: {
      title: 'PostgreSQL Schema & ERD Architecture Document',
      moduleId: dbModule.id,
      deadline: pastDeadline,
    },
  });

  const seAssessment = await prisma.assessment.create({
    data: {
      title: 'Software Design Patterns Portfolio',
      moduleId: advSeModule.id,
      deadline: futureDeadline,
    },
  });

  console.log('✅ Created 3 Assessments (Open & Closed).');

  // 4. Seed 5 Students with distinct Enrolment Statuses & Fee States
  const studentData = [
    {
      studentId: 'SMS-2025-0001',
      fullName: 'Alice Walker',
      email: 'alice.walker@student.university.ac.uk',
      dateOfBirth: new Date('2002-04-15'),
      academicYear: '2025/2026',
      status: EnrolmentStatus.ENROLLED,
      programmeId: csProgramme.id,
      assignedFee: 9250.00,
      payments: [
        { amount: 5000.00, referenceNumber: 'PAY-2025-9901', paymentDate: new Date('2025-09-01') },
        { amount: 4250.00, referenceNumber: 'PAY-2025-9902', paymentDate: new Date('2026-01-10') },
      ],
    },
    {
      studentId: 'SMS-2025-0002',
      fullName: 'Benjamin Hughes',
      email: 'benjamin.hughes@student.university.ac.uk',
      dateOfBirth: new Date('2001-11-20'),
      academicYear: '2025/2026',
      status: EnrolmentStatus.ENROLLED,
      programmeId: csProgramme.id,
      assignedFee: 9250.00,
      payments: [
        { amount: 3000.00, referenceNumber: 'PAY-2025-9903', paymentDate: new Date('2025-09-15') },
      ], // Partial Payment - Overdue
    },
    {
      studentId: 'SMS-2025-0003',
      fullName: 'Chloe Bennett',
      email: 'chloe.bennett@student.university.ac.uk',
      dateOfBirth: new Date('2000-08-05'),
      academicYear: '2025/2026',
      status: EnrolmentStatus.DEFERRED,
      programmeId: seProgramme.id,
      assignedFee: 11500.00,
      payments: [], // Zero Payments - Deferred
    },
    {
      studentId: 'SMS-2025-0004',
      fullName: 'Daniel Kim',
      email: 'daniel.kim@student.university.ac.uk',
      dateOfBirth: new Date('2003-01-12'),
      academicYear: '2025/2026',
      status: EnrolmentStatus.ENROLLED,
      programmeId: csProgramme.id,
      assignedFee: 9250.00,
      payments: [
        { amount: 9250.00, referenceNumber: 'PAY-2025-9904', paymentDate: new Date('2025-08-20') },
      ], // Fully Paid
    },
    {
      studentId: 'SMS-2025-0005',
      fullName: 'Elena Rostova',
      email: 'elena.rostova@student.university.ac.uk',
      dateOfBirth: new Date('1999-05-30'),
      academicYear: '2025/2026',
      status: EnrolmentStatus.COMPLETED,
      programmeId: seProgramme.id,
      assignedFee: 11500.00,
      payments: [
        { amount: 11500.00, referenceNumber: 'PAY-2025-9905', paymentDate: new Date('2025-09-02') },
      ], // Fully Paid
    },
  ];

  const createdStudents = [];

  for (const s of studentData) {
    const student = await prisma.student.create({
      data: {
        studentId: s.studentId,
        fullName: s.fullName,
        email: s.email,
        dateOfBirth: s.dateOfBirth,
        academicYear: s.academicYear,
        status: s.status,
        programmeId: s.programmeId,
      },
    });

    const totalPaid = s.payments.reduce((acc, p) => acc + p.amount, 0);

    const fee = await prisma.fee.create({
      data: {
        studentId: student.id,
        assignedAmount: s.assignedFee,
        totalPaid: totalPaid,
      },
    });

    for (const p of s.payments) {
      await prisma.payment.create({
        data: {
          studentId: student.id,
          feeId: fee.id,
          amount: p.amount,
          referenceNumber: p.referenceNumber,
          paymentDate: p.paymentDate,
        },
      });
    }

    createdStudents.push(student);
  }

  console.log('✅ Created 5 Students, Fees, and Payment Transactions.');

  // 5. Seed Submissions & Results
  // Alice: On-time submission, Distinction grade, PUBLISHED
  const sub1 = await prisma.submission.create({
    data: {
      assessmentId: dbAssessment.id,
      studentId: createdStudents[0].id, // Alice
      filePath: '/uploads/demo_alice_db.pdf',
      fileName: 'Alice_Walker_Database_ERD.pdf',
      submittedAt: new Date(pastDeadline.getTime() - 24 * 60 * 60 * 1000), // 1 day before deadline
      isLate: false,
    },
  });

  await prisma.result.create({
    data: {
      submissionId: sub1.id,
      numericGrade: 85,
      classification: GradeClassification.DISTINCTION,
      isPublished: true,
    },
  });

  // Benjamin: Late submission, Merit grade, WITHHELD
  const sub2 = await prisma.submission.create({
    data: {
      assessmentId: dbAssessment.id,
      studentId: createdStudents[1].id, // Benjamin
      filePath: '/uploads/demo_benjamin_db.docx',
      fileName: 'Benjamin_Hughes_DB_Submission.docx',
      submittedAt: new Date(pastDeadline.getTime() + 12 * 60 * 60 * 1000), // 12 hrs past deadline
      isLate: true,
    },
  });

  await prisma.result.create({
    data: {
      submissionId: sub2.id,
      numericGrade: 68,
      classification: GradeClassification.MERIT,
      isPublished: false, // WITHHELD from student
    },
  });

  // Daniel: On-time submission, Pass grade, PUBLISHED
  const sub3 = await prisma.submission.create({
    data: {
      assessmentId: webAssessment.id,
      studentId: createdStudents[3].id, // Daniel
      filePath: '/uploads/demo_daniel_web.pdf',
      fileName: 'Daniel_Kim_Registry_App.pdf',
      submittedAt: new Date(),
      isLate: false,
    },
  });

  await prisma.result.create({
    data: {
      submissionId: sub3.id,
      numericGrade: 55,
      classification: GradeClassification.PASS,
      isPublished: true,
    },
  });

  console.log('✅ Created Submissions & Results (On-time, Late, Published, Withheld).');
  console.log('🎉 Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
