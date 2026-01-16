import { Test, TestingModule } from '@nestjs/testing';
import { Member } from '@/domain/member';
import {
  createMemberRegisterRequest,
  createPasswordEncoder,
} from '../../domain/member-fixture';
import { MemberRepository } from '@/application/required/member.repository';
import { AppModule } from '@/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

describe('MemberRepositoryTest', () => {
  let app: INestApplication;
  let memberRepository: MemberRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    memberRepository = moduleFixture.get<MemberRepository>(
      getRepositoryToken(Member),
    );
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
  });

  // it('findMemberById', async () => {
  //   const member1: Member = Member.register(
  //     createMemberRegisterRequest(),
  //     createPasswordEncoder(),
  //   );
  //
  //   await memberRepository.save(member1);
  //
  //   const member2 = await memberRepository.find();
  //
  //   console.log(member2);
  // });
});
