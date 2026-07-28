import { Instructor } from '@/domain/instructor/instructor';
import { InstructorApplyRequest } from '@/application/instructor/provided/instructor-apply.request';

/**
 * 강사 신청
 */
export interface InstructorApplication {
  apply(applyRequest: InstructorApplyRequest): Promise<Instructor>;

  approve(instructorId: number): Promise<Instructor>;

  reject(instructorId: number): Promise<Instructor>;
}

export const INSTRUCTOR_APPLICATION: symbol = Symbol('InstructorApplication');
