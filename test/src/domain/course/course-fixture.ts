import { faker } from '@faker-js/faker';
import { Course } from '@/domain/course/course';
import { Instructor } from '@/domain/instructor/instructor';
import { InstructorFixture } from '../instructor/instructor-fixture';

export class CourseFixture {
  public static createCourse(instructor?: Instructor, title?: string): Course {
    return new Course(
      instructor ?? InstructorFixture.createActiveInstructor(),
      title ?? faker.string.alpha({ length: { min: 2, max: 100 } }),
      faker.lorem.sentence(),
    );
  }
}
