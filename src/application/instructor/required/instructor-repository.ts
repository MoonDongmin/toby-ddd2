import { Instructor } from '@/domain/instructor/instructor';

export interface InstructorRepository {
  save(instructor: Instructor): Promise<Instructor>;

  findById(instructorId: number): Promise<Instructor | null>;

  findByMemberId(memberId: number): Promise<Instructor | null>;
}

export const INSTRUCTOR_REPOSITORY: symbol = Symbol('InstructorRepository');
