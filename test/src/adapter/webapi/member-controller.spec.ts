import { INestApplication } from '@nestjs/common';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { MemberRegister } from '@/application/member/provided/member-register';
import { SplearnTestConfiguration } from '../../../splearn-test-configuration';
import {
  createMember,
  createMemberRegisterRequest,
} from '../../domain/member/member-fixture';
import { Member } from '@/domain/member/member';
import request, { Response } from 'supertest';

describe('Member Controller Test', () => {
  let app: INestApplication;
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

    memberRegister =
      moduleFixture.get<MemberModifyService>(MemberModifyService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('register', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = createMember(1);

    const response: Response = await request(app.getHttpServer())
      .post('/api/members')
      .set('Content-Type', 'application/json')
      .send({
        email: member.getEmail().getAddress(),
        nickname: member.getNickname(),
        password: 'secret',
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.memberId).toEqual(1);
  });

  it('registerFail', async () => {
    const member = createMemberRegisterRequest('invalid email');

    const response: Response = await request(app.getHttpServer())
      .post('/api/members')
      .send(member);

    console.log(response.statusCode);

    expect(response.statusCode).toEqual(400);
  });
});
