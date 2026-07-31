import { Course } from '@/domain/course/course';

/**
 * 강의 공개와 관련된 작업
 */
export interface CoursePublisher {
  submitForReview(courseId: number): Promise<Course>;

  publish(courseId: number): Promise<Course>;

  archive(courseId: number): Promise<Course>;
}
