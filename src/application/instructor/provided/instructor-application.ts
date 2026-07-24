import { Instructor } from '@/domain/instructor/instructor';
import { InstructorApplyRequest } from '@/application/instructor/provided/instructor-apply.request';

/**
 * 강사 신청
 */
export interface InstructorApplication {
  apply(applyRequest: InstructorApplyRequest): Instructor;

  approve(memberId: number): Instructor;

  reject(memberId: number): Instructor;
}

export const INSTRUCTOR_APPLICATION: symbol = Symbol('InstructorApplication');
