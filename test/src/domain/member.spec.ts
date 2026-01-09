import { Member } from '@/domain/member';
import { MemberStatus } from '@/domain/member-status';
import { IllegalStateException } from '@/common/exceptions/illegal-argument.exception';
import { PasswordEncoder } from '@/domain/password-encoder';

describe('MemberTest', () => {
  let member: Member;
  let passwordEncoder: PasswordEncoder;

  beforeEach(() => {
    passwordEncoder = {
      encode: (password: string) => password.toUpperCase(),
      matches: (password: string, passwordHash: string) =>
        passwordEncoder.encode(password) === passwordHash,
    };

    member = Member.create(
      'dongmin@test.com',
      'dongmin',
      'secret',
      passwordEncoder,
    );
  });

  it('createMember', () => {
    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);
  });

  // it('constructorNullCheck', () => {
  //   // Then: 테스트 결과를 검증하는 단계
  //   expect(() => new Member(null, 'dongmin', 'secret')).toThrow(
  //     IllegalArgumentException,
  //   );
  // });

  it('activate', () => {
    // When: 테스트를 진행하는 단계
    member.activate();

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.ACTIVE);
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

  it('changeNickname', () => {
    // Given: 테스트 실행을 준비하는 단계
    expect(member.getNickname()).toEqual('dongmin');

    // When: 테스트를 진행하는 단계
    member.changeNickname('Charlie');

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getNickname()).toEqual('Charlie');
  });

  it('changePassword', () => {
    // Given: 테스트 실행을 준비하는 단계
    // When: 테스트를 진행하는 단계
    member.changePassword('verysecret', passwordEncoder);

    // Then: 테스트 결과를 검증하는 단계
    expect(member.verifyPassword('verysecret', passwordEncoder)).toBeTruthy();
  });
});
