import { Course } from '@/domain/course/course';
import { Instructor } from '@/domain/instructor/instructor';

export interface CourseRepository {
  save(course: Course): Promise<Course>;

  findById(id: number): Promise<Course | null>;

  findByTitleContaining(keyword: string): Promise<Course[]>;

  findByInstructor(instructor: Instructor): Promise<Course[]>;

  findByInstructorId(instructorId: number): Promise<Course[]>;
}

export const COURSE_REPOSITORY: symbol = Symbol('CourseRepository');
