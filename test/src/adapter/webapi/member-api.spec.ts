import { HttpStatus, INestApplication } from '@nestjs/common';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { MemberRegister } from '@/application/member/provided/member-register';
import { SplearnTestConfiguration } from '../../../splearn-test-configuration';
import { createMemberRegisterRequest } from '../../domain/member/member-fixture';
import { Member } from '@/domain/member/member';
import request, { Response } from 'supertest';
import { MemberRegisterRequest } from '@/domain/member/member-register.request';
import {
  MEMBER_REPOSITORY,
  MemberRepository,
} from '@/application/member/required/member-repository';
import { MemberStatus } from '@/domain/member/member-status';

describe('Member Controller Test', () => {
  let app: INestApplication;
  let memberRegister: MemberRegister;
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

    memberRepository = moduleFixture.get<MemberRepository>(MEMBER_REPOSITORY);

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('register', async () => {
    const registerRequest: MemberRegisterRequest =
      createMemberRegisterRequest();

    const requestBody = {
      email: registerRequest.email,
      nickname: registerRequest.nickname,
      password: registerRequest.password,
    };

    const response: Response = await request(app.getHttpServer())
      .post('/api/members')
      .set('Content-Type', 'application/json')
      .send(requestBody);

    expect(response).toBeDefined();
    expect(response.body.memberId).toBeDefined();
    expect(response.body.email).toBe(registerRequest.email);

    const member: Member | null = await memberRepository.findById(
      response.body.memberId as number,
    );

    expect(member!.getEmail().getAddress()).toEqual(registerRequest.email);
    expect(member!.getNickname()).toEqual(registerRequest.nickname);
    expect(member!.getStatus()).toEqual(MemberStatus.PENDING);
  });

  it('duplicateEmail', async () => {
    const existingRequest: MemberRegisterRequest =
      createMemberRegisterRequest();
    await memberRegister.register(existingRequest);

    const duplicateRequestBody = {
      email: existingRequest.email,
      nickname: existingRequest.nickname,
      password: existingRequest.password,
    };

    const response: Response = await request(app.getHttpServer())
      .post('/api/members')
      .set('Content-Type', 'application/json')
      .send(duplicateRequestBody);

    console.log('Response body:', response.body);

    expect(response.status).toBe(HttpStatus.CONFLICT);
  });
});
