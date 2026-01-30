import { INestApplication } from '@nestjs/common';
import { MemberService } from '@/application/member.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Member } from '@/domain/member';
import { createMemberRegisterRequest } from '../../domain/member-fixture';
import { MemberStatus } from '@/domain/member-status';
import { SplearnTestConfiguration } from '../../../splearn-test-configuration';
import { DuplicateEmailException } from '@/domain/duplicate-email.exception';

describe('Member Service Test', () => {
  let app: INestApplication;
  const config = new SplearnTestConfiguration();
  let memberRegister: MemberService;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MemberService,
        {
          provide: 'EmailSender',
          useValue: config.emailSender(),
        },
        {
          provide: 'PasswordEncoder',
          useValue: config.passwordEncoder(),
        },
        {
          provide: 'MemberRepository',
          useValue: config.memberRepository(),
        },
        // {
        //   provide: 'MemberRepository',
        //   useFactory: (dataSource: DataSource) => {
        //     return dataSource.getRepository(Member);
        //   },
        //   inject: [getDataSourceToken()],
        // },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    memberRegister = moduleFixture.get<MemberService>(MemberService);

    await app.init();
  });

  beforeEach(() => {
    config.resetMemberRepository();
  });

  it('register', async () => {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    expect(member.getId()).toBe(1);
    expect(member.getStatus()).toBe(MemberStatus.PENDING);
  });

  it('duplicateEmailFail', async () => {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    await expect(
      memberRegister.register(createMemberRegisterRequest()),
    ).rejects.toThrow(DuplicateEmailException);
  });
});
