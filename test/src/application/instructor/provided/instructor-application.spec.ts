import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SplearnTestConfiguration } from '../../../../splearn-test-configuration';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { InstructorApplication } from '@/application/instructor/provided/instructor-application';
import { InstructorModifyService } from '@/application/instructor/instructor-modify.service';
import { Member } from '@/domain/member/member';
import { createActiveMember } from '../../../domain/member/member-fixture';
import {
  MEMBER_REPOSITORY,
  MemberRepository,
} from '@/application/member/required/member-repository';
import { Instructor } from '@/domain/instructor/instructor';
import { InstructorStatus } from '@/domain/instructor/instructor-status.enum';
import {
  INSTRUCTOR_REPOSITORY,
  InstructorRepository,
} from '@/application/instructor/required/instructor-repository';
import { InstructorFixture } from '../../../domain/instructor/instructor-fixture';
import { DuplicatedInstructorApplicationException } from '@/application/instructor/provided/duplicated-instructor-application.excpetion';

describe('InstructorApplicationTest', () => {
  let app: INestApplication;
  let instructorApplication: InstructorApplication;
  let instructorRepository: InstructorRepository;
  let memberRepository: MemberRepository;
  let dataSource: DataSource;

  const config = new SplearnTestConfiguration();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_SENDER)
      .useValue(config.emailSender())
      .compile();

    app = moduleFixture.createNestApplication();

    instructorApplication = moduleFixture.get<InstructorModifyService>(
      InstructorModifyService,
    );
    instructorRepository = moduleFixture.get<InstructorRepository>(
      INSTRUCTOR_REPOSITORY,
    );
    memberRepository = moduleFixture.get<MemberRepository>(MEMBER_REPOSITORY);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('apply', async () => {
    const member: Member = createActiveMember();
    await memberRepository.save(member);

    const instructor: Instructor = await instructorApplication.apply(
      InstructorFixture.createApplyRequest(member),
    );

    expect(instructor.id).not.toBeNull();
    expect(instructor.status).toEqual(InstructorStatus.PENDING);

    await instructorRepository.findById(instructor.id);
  });

  it('duplicateApply', async () => {
    const member: Member = createActiveMember();
    await memberRepository.save(member);

    await instructorApplication.apply(
      InstructorFixture.createApplyRequest(member),
    );

    await expect(
      instructorApplication.apply(InstructorFixture.createApplyRequest(member)),
    ).rejects.toThrow(DuplicatedInstructorApplicationException);
  });

  it('approve', async () => {
    const instructor: Instructor = await instructorApplication.approve(
      (await preparePendingInstructor()).id,
    );

    expect(instructor.status).toEqual(InstructorStatus.ACTIVE);
  });

  it('reject', async () => {
    const instructor: Instructor = await instructorApplication.reject(
      (await preparePendingInstructor()).id,
    );

    expect(instructor.status).toEqual(InstructorStatus.REJECTED);
  });

  async function preparePendingInstructor(): Promise<Instructor> {
    const member: Member = createActiveMember();
    await memberRepository.save(member);
    return await instructorApplication.apply(
      InstructorFixture.createApplyRequest(member),
    );
  }
});
