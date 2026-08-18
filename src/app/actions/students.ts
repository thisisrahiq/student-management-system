'use server';

import { prisma } from '@/lib/prisma';
import { studentSchema, StudentFormValues } from '@/lib/validations';
import { generateNextStudentId } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { EnrolmentStatus } from '@prisma/client';

export async function createStudent(data: StudentFormValues) {
  try {
    const validated = studentSchema.parse(data);

    // Check duplicate email
    const existingEmail = await prisma.student.findUnique({
      where: { email: validated.email },
    });

    if (existingEmail) {
      return { success: false, error: 'A student with this email address is already registered.' };
    }

    // Fetch programme to obtain base fee
    const programme = await prisma.programme.findUnique({
      where: { id: validated.programmeId },
    });

    if (!programme) {
      return { success: false, error: 'Selected programme not found.' };
    }

    // Auto-generate Student ID
    const year = new Date().getFullYear();
    const count = await prisma.student.count();
    const nextStudentId = generateNextStudentId(count + 1, year);

    // Create student and default fee statement in transaction
    const student = await prisma.$transaction(async (tx) => {
      const newStudent = await tx.student.create({
        data: {
          studentId: nextStudentId,
          fullName: validated.fullName,
          email: validated.email,
          dateOfBirth: new Date(validated.dateOfBirth),
          academicYear: validated.academicYear,
          status: validated.status as EnrolmentStatus,
          programmeId: validated.programmeId,
        },
      });

      await tx.fee.create({
        data: {
          studentId: newStudent.id,
          assignedAmount: programme.baseFee,
          totalPaid: 0,
        },
      });

      return newStudent;
    });

    revalidatePath('/staff/students');
    revalidatePath('/staff');

    return { success: true, student: JSON.parse(JSON.stringify(student)) };
  } catch (err: any) {
    console.error('Error creating student:', err);
    return { success: false, error: err.message || 'Failed to enroll student.' };
  }
}

export async function updateStudent(id: string, data: Partial<StudentFormValues>) {
  try {
    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.email && { email: data.email }),
        ...(data.academicYear && { academicYear: data.academicYear }),
        ...(data.status && { status: data.status as EnrolmentStatus }),
        ...(data.programmeId && { programmeId: data.programmeId }),
      },
    });

    revalidatePath('/staff/students');
    revalidatePath('/staff');

    return { success: true, student: JSON.parse(JSON.stringify(updated)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update student record.' };
  }
}

export async function getStudents(query?: string, programmeId?: string, status?: string) {
  try {
    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { fullName: { contains: query, mode: 'insensitive' } },
        { studentId: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (programmeId && programmeId !== 'ALL') {
      whereClause.programmeId = programmeId;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status as EnrolmentStatus;
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        programme: true,
        fee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, students: JSON.parse(JSON.stringify(students)) };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch students.', students: [] };
  }
}

export async function getProgrammes() {
  try {
    const programmes = await prisma.programme.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, programmes: JSON.parse(JSON.stringify(programmes)) };
  } catch (err: any) {
    return { success: false, programmes: [] };
  }
}
