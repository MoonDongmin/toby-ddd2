import { Instructor } from '@/domain/instructor/instructor';

export interface InstructorFinder {
  find(instructorId: number): Promise<Instructor>;

  findByMember(memberId: number): Promise<Instructor | null>;

  findByMember(memberId: number): Promise<Instructor | null>;
}

export const INSTRUCTOR_FINDER: symbol = Symbol('InstructorFinder');
