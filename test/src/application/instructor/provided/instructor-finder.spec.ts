import { INestApplication, NotFoundException } from '@nestjs/common';
import { InstructorApplication } from '@/application/instructor/provided/instructor-application';
import { DataSource } from 'typeorm';
import { SplearnTestConfiguration } from '../../../../splearn-test-configuration';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { InstructorModifyService } from '@/application/instructor/instructor-modify.service';
import { InstructorFinder } from '@/application/instructor/provided/instructor-finder';
import { MemberRegister } from '@/application/member/provided/member-register';
import { InstructorQueryService } from '@/application/instructor/instructor-query.service';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { createMemberRegisterRequest } from '../../../domain/member/member-fixture';
import { InstructorApplyRequest } from '@/application/instructor/provided/instructor-apply.request';
import { Member } from '@/domain/member/member';
import { Instructor } from '@/domain/instructor/instructor';

describe('InstructorFinderTest', () => {
  let app: INestApplication;
  let instructorFinder: InstructorFinder;
  let instructorApplication: InstructorApplication;
  let memberRegister: MemberRegister;
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
    instructorFinder = moduleFixture.get<InstructorQueryService>(
      InstructorQueryService,
    );
    memberRegister =
      moduleFixture.get<MemberModifyService>(MemberModifyService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('findByMember', async () => {
    let member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );
    member = await memberRegister.activate(member.getId());

    const instructor: Instructor = await instructorApplication.apply(
      new InstructorApplyRequest(member.getId()),
    );

    const found: Instructor | null = await instructorFinder.findByMember(
      member.getId(),
    );
    if (!found) {
      throw new NotFoundException();
    }

    expect(instructor).toEqual(found);

    await expect(
      instructorFinder.findByMember(2147483647),
    ).resolves.toBeFalsy();
  });
});
