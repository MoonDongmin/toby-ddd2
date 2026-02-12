import { INestApplication } from '@nestjs/common';
import { SplearnTestConfiguration } from '../../../../splearn-test-configuration';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { MemberRegister } from '@/application/member/provided/member-register';
import { MemberFinder } from '@/application/member/provided/member-finder';
import { Member } from '@/domain/member/member';
import { createMemberRegisterRequest } from '../../../domain/member/member-fixture';
import { MemberQueryService } from '@/application/member/member-query.service';

describe('MemberFinderTest', () => {
  let app: INestApplication;
  let memberRegister: MemberRegister;
  let memberFinder: MemberFinder;
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
    memberFinder = moduleFixture.get<MemberQueryService>(MemberQueryService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('find', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member | null = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    // When: 테스트를 진행하는 단계
    const found: Member = await memberFinder.find(member.getId());

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getId()).toEqual(found.getId());
  });

  it('findFail', async () => {
    await expect(memberFinder.find(999)).rejects.toThrow();
  });
});
