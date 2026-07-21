import { INestApplication } from '@nestjs/common';
import { SplearnTestConfiguration } from '../../../../splearn-test-configuration';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { MemberRegister } from '@/application/member/provided/member-register';
import { Member } from '@/domain/member/member';
import { createMemberRegisterRequest } from '../../../domain/member/member-fixture';
import { MemberAuthenticator } from '@/application/member/provided/member-authenticator';
import { MemberAuthenticationService } from '@/application/member/member-authentication.service';
import { MemberRegisterRequest } from '@/application/member/provided/member-register.request';
import { MemberLoginRequest } from '@/application/member/provided/member-login.request';
import {
  MEMBER_REPOSITORY,
  type MemberRepository,
} from '@/application/member/required/member-repository';
import { LoginFailedException } from '@/application/member/provided/login-failed.exception';

describe('MemberAuthenticatorTest', () => {
  let app: INestApplication;
  let memberRegister: MemberRegister;
  let memberAuthenticator: MemberAuthenticator;
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

    memberRegister =
      moduleFixture.get<MemberModifyService>(MemberModifyService);
    memberAuthenticator = moduleFixture.get<MemberAuthenticationService>(
      MemberAuthenticationService,
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

  it('login', async () => {
    const registerRequest: MemberRegisterRequest =
      createMemberRegisterRequest();
    const member: Member = await memberRegister.register(registerRequest);
    member.activate();
    await memberRepository.save(member);

    await memberAuthenticator.login(
      new MemberLoginRequest(registerRequest.email, registerRequest.password),
    );
  });

  it('loginFailedNotActive', async () => {
    const registerRequest: MemberRegisterRequest =
      createMemberRegisterRequest();
    await memberRegister.register(registerRequest);

    await expect(
      memberAuthenticator.login(
        new MemberLoginRequest(registerRequest.email, registerRequest.password),
      ),
    ).rejects.toThrow(LoginFailedException);
  });

  it('loginFailedEmailNotExists', async () => {
    const registerRequest: MemberRegisterRequest =
      createMemberRegisterRequest();
    const member: Member = await memberRegister.register(registerRequest);
    member.activate();
    await memberRepository.save(member);

    await expect(
      memberAuthenticator.login(
        new MemberLoginRequest('test@test.com', registerRequest.password),
      ),
    ).rejects.toThrow(LoginFailedException);
  });

  it('loginFailedWrongPassword', async () => {
    const registerRequest: MemberRegisterRequest =
      createMemberRegisterRequest();
    const member: Member = await memberRegister.register(registerRequest);
    member.activate();
    await memberRepository.save(member);

    await expect(
      memberAuthenticator.login(
        new MemberLoginRequest(registerRequest.email, 'wrongPassword'),
      ),
    ).rejects.toThrow(LoginFailedException);
  });
});
