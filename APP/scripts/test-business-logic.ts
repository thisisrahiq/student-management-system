import {
  calculateClassification,
  generateNextStudentId,
  calculateOutstandingBalance,
  checkIsOverdue,
} from '../src/lib/utils';
import { studentSchema, paymentSchema, gradeSchema } from '../src/lib/validations';

function runTests() {
  console.log('🧪 Running Business Logic & Domain Unit Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Student ID Generation
  console.log('Test Suite 1: Student ID Auto-Generator');
  assert(generateNextStudentId(1, 2025) === 'SMS-2025-0001', 'Counter 1 -> SMS-2025-0001');
  assert(generateNextStudentId(42, 2025) === 'SMS-2025-0042', 'Counter 42 -> SMS-2025-0042');
  assert(generateNextStudentId(1000, 2026) === 'SMS-2026-1000', 'Counter 1000 -> SMS-2026-1000');

  // Test 2: Grade Classification Boundaries
  console.log('\nTest Suite 2: Academic Grade Classification Boundaries');
  assert(calculateClassification(85) === 'DISTINCTION', 'Grade 85 -> DISTINCTION');
  assert(calculateClassification(70) === 'DISTINCTION', 'Boundary Grade 70 -> DISTINCTION');
  assert(calculateClassification(68) === 'MERIT', 'Grade 68 -> MERIT');
  assert(calculateClassification(60) === 'MERIT', 'Boundary Grade 60 -> MERIT');
  assert(calculateClassification(55) === 'PASS', 'Grade 55 -> PASS');
  assert(calculateClassification(40) === 'PASS', 'Boundary Grade 40 -> PASS');
  assert(calculateClassification(39) === 'FAIL', 'Grade 39 -> FAIL');
  assert(calculateClassification(0) === 'FAIL', 'Boundary Grade 0 -> FAIL');

  try {
    calculateClassification(105);
    assert(false, 'Grade > 100 should throw error');
  } catch {
    assert(true, 'Grade > 100 correctly throws error');
  }

  try {
    calculateClassification(-5);
    assert(false, 'Grade < 0 should throw error');
  } catch {
    assert(true, 'Grade < 0 correctly throws error');
  }

  // Test 3: Financial Outstanding Balance & Overdue Auditing
  console.log('\nTest Suite 3: Financial Balance & Overdue Calculation');
  assert(calculateOutstandingBalance(9250, 5000) === 4250, '9250 assigned - 5000 paid = 4250 balance');
  assert(calculateOutstandingBalance(9250, 9250) === 0, 'Full payment -> 0 balance');
  assert(checkIsOverdue(9250, 5000) === true, 'Partial payment -> Overdue true');
  assert(checkIsOverdue(9250, 9250) === false, 'Full payment -> Overdue false');

  // Test 4: Zod Validation Schemas
  console.log('\nTest Suite 4: Schema Validation Controls');
  const validStudent = studentSchema.safeParse({
    fullName: 'Test Student',
    email: 'test@university.ac.uk',
    dateOfBirth: '2001-01-01',
    academicYear: '2025/2026',
    status: 'ENROLLED',
    programmeId: 'prog_123',
  });
  assert(validStudent.success === true, 'Valid student form passes validation');

  const invalidEmailStudent = studentSchema.safeParse({
    fullName: 'Test Student',
    email: 'invalid-email-string',
    dateOfBirth: '2001-01-01',
    academicYear: '2025/2026',
    status: 'ENROLLED',
    programmeId: 'prog_123',
  });
  assert(invalidEmailStudent.success === false, 'Invalid email fails validation');

  const invalidGrade = gradeSchema.safeParse({
    submissionId: 'sub_123',
    numericGrade: 150,
  });
  assert(invalidGrade.success === false, 'Numeric grade 150 fails validation (0-100 limit)');

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} PASSED | ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
