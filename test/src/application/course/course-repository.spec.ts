import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  COURSE_REPOSITORY,
  CourseRepository,
} from '@/application/course/required/course-repository';
import {
  MEMBER_REPOSITORY,
  MemberRepository,
} from '@/application/member/required/member-repository';
import {
  INSTRUCTOR_REPOSITORY,
  InstructorRepository,
} from '@/application/instructor/required/instructor-repository';
import { Course } from '@/domain/course/course';
import { CourseFixture } from '../../domain/course/course-fixture';
import { Member } from '@/domain/member/member';
import { createActiveMember } from '../../domain/member/member-fixture';
import { Instructor } from '@/domain/instructor/instructor';
import { InstructorFixture } from '../../domain/instructor/instructor-fixture';
import { IllegalStateException } from '@/common/exceptions/illegal-argument.exception';

describe('CourseRepositoryTest', () => {
  let app: INestApplication;
  let courseRepository: CourseRepository;
  let memberRepository: MemberRepository;
  let instructorRepository: InstructorRepository;
  let dataSource: DataSource;

  let member: Member;
  let instructor: Instructor;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    courseRepository = moduleFixture.get<CourseRepository>(COURSE_REPOSITORY);
    memberRepository = moduleFixture.get<MemberRepository>(MEMBER_REPOSITORY);
    instructorRepository = moduleFixture.get<InstructorRepository>(
      INSTRUCTOR_REPOSITORY,
    );
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);

    member = await memberRepository.save(createActiveMember());
    instructor = await instructorRepository.save(
      InstructorFixture.createActiveInstructor(member),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('saveAndFindId', async () => {
    let course: Course = CourseFixture.createCourse(instructor);
    course = await courseRepository.save(course);

    expect(course.getId()).toBeDefined();

    const found: Course | null = await courseRepository.findById(
      course.getId(),
    );

    expect(found).toEqual(course);
  });

  const prepareCourse = (
    instructor: Instructor,
    title: string,
  ): Promise<Course> =>
    courseRepository.save(CourseFixture.createCourse(instructor, title));

  it('findByTitleContaining', async () => {
    const ids: number[] = [];
    for (const title of ['Hello Spring', 'Clean Spring 2', 'Clean Code']) {
      ids.push((await prepareCourse(instructor, title)).getId());
    }

    const findIdsByTitle = async (keyword: string): Promise<number[]> =>
      (await courseRepository.findByTitleContaining(keyword)).map(
        (course: Course) => course.getId(),
      );

    expect(await findIdsByTitle('Spring')).toEqual([ids[0], ids[1]]);
    expect(await findIdsByTitle('Clean')).toEqual([ids[1], ids[2]]);
    expect(await findIdsByTitle('Code')).toEqual([ids[2]]);
    expect(await findIdsByTitle('JPA')).toEqual([]);
  });

  it('findByInstructor', async () => {
    const member2: Member = await memberRepository.save(createActiveMember());
    const instructor2: Instructor = await instructorRepository.save(
      InstructorFixture.createActiveInstructor(member2),
    );

    const course: Course = await courseRepository.save(
      CourseFixture.createCourse(instructor, 'Title'),
    );
    const course2: Course = await courseRepository.save(
      CourseFixture.createCourse(instructor2, 'Title2'),
    );

    const courses: Course[] = await courseRepository.findByInstructorId(
      instructor.id,
    );
    expect(courses).toHaveLength(1);
    expect(courses).toEqual([course]);

    const courses2: Course[] = await courseRepository.findByInstructorId(
      instructor2.id,
    );
    expect(courses2).toHaveLength(1);
    expect(courses2).toEqual([course2]);

    const courses2_1: Course[] =
      await courseRepository.findByInstructor(instructor2);
    expect(courses2_1).toHaveLength(1);
    expect(courses2_1).toEqual([course2]);
  });

  it('uniqueTitleAndInstructor', async () => {
    await courseRepository.save(
      CourseFixture.createCourse(instructor, 'Title'),
    );

    await expect(
      courseRepository.save(CourseFixture.createCourse(instructor, 'Title')),
    ).rejects.toThrow(QueryFailedError);
  });
});
