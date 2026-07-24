import { Instructor } from '@/domain/instructor/instructor';

export interface InstructorFinder {
  find(instructorId: number): Instructor;

  findByMember(memberId: number): Instructor | null;

  findByMember(member: number): Instructor | null;
}

export const INSTRUCTOR_FINDER: symbol = Symbol('InstructorFinder');
