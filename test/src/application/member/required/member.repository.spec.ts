import { Test, TestingModule } from '@nestjs/testing';
import { Member } from '@/domain/member/member';
import {
  createMemberRegisterRequest,
  createPasswordEncoder,
} from '../../../domain/member/member-fixture';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import {
  MEMBER_REPOSITORY,
  type MemberRepository,
} from '@/application/member/required/member-repository';
import { MemberStatus } from '@/domain/member/member-status';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { PASSWORD_ENCODER } from '@/domain/member/password-encoder';

describe('MemberRepositoryTest', () => {
  let app: INestApplication;
  let memberRepository: MemberRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_SENDER)
      .useValue({})
      .overrideProvider(PASSWORD_ENCODER)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    memberRepository = moduleFixture.get<MemberRepository>(MEMBER_REPOSITORY);

    await app.init();
  });

  it('createMember', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = Member.register(
      createMemberRegisterRequest(),
      createPasswordEncoder(),
    );

    expect(member.getId()).toBeUndefined();

    // When: 테스트를 진행하는 단계
    // Then: 테스트 결과를 검증하는 단계
    await memberRepository.save(member);

    expect(member.getId()).toBeDefined();

    const found: Member | null = await memberRepository.findById(
      member.getId(),
    );

    expect(found!.getStatus()).toEqual(MemberStatus.PENDING);
    expect(found!.getDetail().getRegisteredAt()).toBeDefined();
  });

  it('duplicateEmailFail', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = Member.register(
      createMemberRegisterRequest('AAA@test.com'),
      createPasswordEncoder(),
    );

    await memberRepository.save(member);

    // When: 테스트를 진행하는 단계
    const member2: Member = Member.register(
      createMemberRegisterRequest('AAA@test.com'),
      createPasswordEncoder(),
    );

    // Then: 테스트 결과를 검증하는 단계
    await expect(memberRepository.save(member2)).rejects.toThrow();
  });
});
