import { INestApplication } from '@nestjs/common';
import { MemberService } from '@/application/member.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Member } from '@/domain/member';
import { createMemberRegisterRequest } from '../../domain/member-fixture';
import { MemberStatus } from '@/domain/member-status';
import { SplearnTestConfiguration } from '../../../splearn-test-configuration';
import { DuplicateEmailException } from '@/domain/duplicate-email.exception';
import { DataSource } from 'typeorm';

describe('Member Service Test', () => {
  let app: INestApplication;
  const config = new SplearnTestConfiguration();
  let memberRegister: MemberService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('EMAIL_SENDER')
      .useValue(config.emailSender())
      .overrideProvider('PASSWORD_ENCODER')
      .useValue(config.passwordEncoder())
      .compile();

    app = moduleFixture.createNestApplication();

    memberRegister = moduleFixture.get<MemberService>(MemberService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('register', async () => {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    expect(member.getId()).toBe(1);
    expect(member.getStatus()).toBe(MemberStatus.PENDING);
  });

  it('duplicateEmailFail', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    await expect(
      memberRegister.register(createMemberRegisterRequest()),
    ).rejects.toThrow(DuplicateEmailException);
  });
});
