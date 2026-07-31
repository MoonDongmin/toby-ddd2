import { Course } from '@/domain/course/course';

/**
 * 강의를 조회
 */
export interface CourseFinder {
  find(courseId: number): Promise<Course>;

  findByTitle(keyword: string): Promise<Course[]>;

  findByInstructor(instructorId: number): Promise<Course[]>;
}
