import { z } from 'zod';

export const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid date of birth required',
  }),
  academicYear: z.string().min(4, 'Academic year is required (e.g. 2025/2026)'),
  status: z.enum(['ENROLLED', 'DEFERRED', 'WITHDRAWN', 'COMPLETED']),
  programmeId: z.string().min(1, 'Programme selection is required'),
});

export const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required'),
  feeId: z.string().min(1, 'Fee record ID is required'),
  amount: z
    .number({ invalid_type_error: 'Payment amount must be a number' })
    .positive('Payment amount must be greater than 0'),
  referenceNumber: z
    .string()
    .min(3, 'Payment reference number must be at least 3 characters'),
  paymentDate: z.string().optional(),
});

export const assessmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  moduleId: z.string().min(1, 'Module selection is required'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid submission deadline required',
  }),
});

export const gradeSchema = z.object({
  submissionId: z.string().min(1, 'Submission ID is required'),
  numericGrade: z
    .number({ invalid_type_error: 'Grade must be a number' })
    .min(0, 'Grade cannot be below 0')
    .max(100, 'Grade cannot exceed 100'),
  isPublished: z.boolean().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
export type AssessmentFormValues = z.infer<typeof assessmentSchema>;
export type GradeFormValues = z.infer<typeof gradeSchema>;
