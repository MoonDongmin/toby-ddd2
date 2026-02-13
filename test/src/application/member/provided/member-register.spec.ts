import { INestApplication } from '@nestjs/common';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Member } from '@/domain/member/member';
import { createMemberRegisterRequest } from '../../../domain/member/member-fixture';
import { MemberStatus } from '@/domain/member/member-status';
import { SplearnTestConfiguration } from '../../../../splearn-test-configuration';
import { DuplicateEmailException } from '@/domain/member/duplicate-email.exception';
import { DataSource } from 'typeorm';
import { MemberRegisterRequest } from '@/domain/member/member-register.request';
import { validateOrReject } from 'class-validator';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { MemberRegister } from '@/application/member/provided/member-register';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update.request';

describe('Member Register Test', () => {
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

  async function registerMember() {
    const member: Member = await memberRegister.register(
      createMemberRegisterRequest(),
    );

    return member;
  }

  it('activate', async () => {
    // Given: 테스트 실행을 준비하는 단계
    let member: Member = await registerMember();

    // When: 테스트를 진행하는 단계
    member = await memberRegister.activate(member.getId());

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toBe(MemberStatus.ACTIVE);
    expect(member.getDetail().getActivatedAt()).toBeDefined();
  });

  it('deactivate', async () => {
    // Given: 테스트 실행을 준비하는 단계
    let member: Member = await registerMember();

    // When: 테스트를 진행하는 단계
    member = await memberRegister.activate(member.getId());

    // Then: 테스트 결과를 검증하는 단계
    member = await memberRegister.deactivate(member.getId());

    expect(member.getStatus()).toEqual(MemberStatus.DEACTIVATED);
    expect(member.getDetail().getDeactivatedAt()).toBeDefined();
  });

  it('updateInfo', async () => {
    // Given: 테스트 실행을 준비하는 단계
    let member: Member = await registerMember();

    // When: 테스트를 진행하는 단계
    await memberRegister.activate(member.getId());

    member = await memberRegister.updateInfo(
      member.getId(),
      new MemberInfoUpdateRequest('Peter', 'dongmin100', '자기소개'),
    );

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getDetail().getProfile().getAddress()).toEqual('dongmin100');
  });

  it('memberRegisterRequestFail', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const checkValidation: MemberRegisterRequest = new MemberRegisterRequest(
      'cook1008gmail.com',
      'dong',
      'long',
    );

    // When: 테스트를 진행하는 단계
    // const errors: ValidationError[] = await validate(invalid);
    // await expect(validateOrReject(invalid)).rejects.toThrow();
    await expect(validateOrReject(checkValidation)).rejects.toBeDefined();

    // Then: 테스트 결과를 검증하는 단계
    // expect(errors.length).toEqual(3);
    await expect(memberRegister.register(checkValidation)).rejects.toThrow();
  });
});
