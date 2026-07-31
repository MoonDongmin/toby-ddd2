import { InstructorFixture } from '../instructor/instructor-fixture';
import { Course } from '@/domain/course/course';
import { Instructor } from '@/domain/instructor/instructor';
import { CourseStatus } from '@/domain/course/course-status';
import { IllegalStateException } from '@/common/exceptions/illegal-argument.exception';
import { CourseFixture } from './course-fixture';

describe('CourseTest', () => {
  let course: Course;

  beforeEach(() => {
    course = CourseFixture.createCourse();
  });

  it('create', () => {
    const instructor: Instructor = InstructorFixture.createActiveInstructor();

    const course: Course = new Course(
      instructor,
      'Clean Spring 2',
      'Description',
    );

    expect(course.getInstructor()).toEqual(instructor);
    expect(course.getTitle()).toEqual('Clean Spring 2');
    expect(course.getStatus()).toEqual(CourseStatus.DRAFT);
    expect(course.getDetail().getDescription()).toEqual('Description');
    expect(course.getDetail().getCreatedAt()).toBeDefined();
  });

  it('createFailNotActiveInstructor', () => {
    const instructor: Instructor = InstructorFixture.createInstructor();

    expect(() => new Course(instructor, 'title', null)).toThrow(
      IllegalStateException,
    );
  });

  it('submitForReview', () => {
    course.submitForReview();

    expect(course.getStatus()).toEqual(CourseStatus.IN_REVIEW);

    expect(() => course.submitForReview()).toThrow(IllegalStateException);
  });

  it('publish', () => {
    course.submitForReview();

    course.publish();

    expect(course.getStatus()).toEqual(CourseStatus.PUBLISHED);
    expect(course.getDetail().getPublishedAt()).toBeDefined();

    expect(() => course.publish()).toThrow(IllegalStateException);
  });

  it('archive', () => {
    course.submitForReview();
    course.publish();

    course.archive();

    expect(course.getStatus()).toEqual(CourseStatus.ARCHIVED);
    expect(course.getDetail().getArchivedAt()).toBeDefined();

    expect(() => course.archive()).toThrow(IllegalStateException);
  });
});
