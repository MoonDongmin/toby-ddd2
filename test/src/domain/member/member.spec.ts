import { Member } from '@/domain/member/member';
import { MemberStatus } from '@/domain/member/member-status';
import { IllegalStateException } from '@/common/exceptions/illegal-argument.exception';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import {
  createMemberRegisterRequest,
  createPasswordEncoder,
} from './member-fixture';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update.request';
import { Profile } from '@/domain/member/profile';

describe('MemberTest', () => {
  let member: Member;
  let passwordEncoder: PasswordEncoder;

  beforeEach(() => {
    passwordEncoder = createPasswordEncoder();
    member = Member.register(createMemberRegisterRequest(), passwordEncoder);
  });

  it('registerMember', () => {
    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);
    expect(member.getDetail().getRegisteredAt()).toBeDefined();
  });

  // it('constructorNullCheck', () => {
  //   // Then: 테스트 결과를 검증하는 단계
  //   expect(() => new Member(null, 'dongmin', 'secret')).toThrow(
  //     IllegalArgumentException,
  //   );
  // });

  it('activate', () => {
    // When: 테스트를 진행하는 단계
    expect(member.getDetail().getActivatedAt()).toBeUndefined();

    member.activate();

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.ACTIVE);
    expect(member.getDetail().getActivatedAt()).toBeDefined();
  });

  it('activateFail', () => {
    // When: 테스트를 진행하는 단계
    member.activate();

    // Then: 테스트 결과를 검증하는 단계
    expect(() => member.activate()).toThrowError(IllegalStateException);
  });

  it('deactivate', () => {
    member.activate();

    // When: 테스트를 진행하는 단계
    member.deactivate();

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.DEACTIVATED);
    expect(member.getDetail().getDeactivatedAt()).toBeDefined();
  });

  it('deactivateFail', () => {
    // When: 테스트를 진행하는 단계

    // Then: 테스트 결과를 검증하는 단계
    expect(() => member.deactivate()).toThrowError(IllegalStateException);
    member.activate();
    member.deactivate();

    expect(() => member.deactivate()).toThrowError(IllegalStateException);
  });

  it('verifyPassword', () => {
    // Given: 테스트 실행을 준비하는 단계
    // When: 테스트를 진행하는 단계
    // Then: 테스트 결과를 검증하는 단계
    expect(member.verifyPassword('secret', passwordEncoder)).toBeTruthy();
    expect(member.verifyPassword('hello', passwordEncoder)).toBeFalsy();
  });

  it('changePassword', () => {
    // Given: 테스트 실행을 준비하는 단계
    // When: 테스트를 진행하는 단계
    member.changePassword('verysecret', passwordEncoder);

    // Then: 테스트 결과를 검증하는 단계
    expect(member.verifyPassword('verysecret', passwordEncoder)).toBeTruthy();
  });

  it('isActive', () => {
    expect(member.isActive()).toBeFalsy();

    member.activate();

    expect(member.isActive()).toBeTruthy();

    member.deactivate();

    expect(member.isActive()).toBeFalsy();
  });

  it('invalidEmail', () => {
    // Given: 테스트 실행을 준비하는 단계
    expect(() =>
      Member.register(
        createMemberRegisterRequest('invalid email'),
        passwordEncoder,
      ),
    ).toThrowError();

    Member.register(createMemberRegisterRequest(), passwordEncoder);
  });

  it('updateInfo', () => {
    // Given: 테스트 실행을 준비하는 단계
    member.activate();
    const request: MemberInfoUpdateRequest = new MemberInfoUpdateRequest(
      'Leo',
      'dongmin100',
      '자기소개',
    );
    // When: 테스트를 진행하는 단계
    member.updateInfo(request);

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getNickname()).toEqual(request.nickname);
    expect(member.getDetail().getProfile().getAddress()).toEqual(
      request.profileAddress,
    );
    expect(member.getDetail().getIntroduction()).toEqual(request.introduction);
  });

  it('updateInfoFail', () => {
    expect(() => {
      const request = new MemberInfoUpdateRequest(
        'Leo',
        'dongmin100',
        '자기소개',
      );
      member.updateInfo(request);
    }).toThrow(IllegalStateException);
  });

  it('url ', () => {
    // Given: 테스트 실행을 준비하는 단계
    const profile: Profile = new Profile('dongmin');

    // Then: 테스트 결과를 검증하는 단계
    expect(profile.url()).toEqual('@dongmin');
  });
});
