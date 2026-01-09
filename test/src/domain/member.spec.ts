import { Member } from '@/domain/member';
import { MemberStatus } from '@/domain/member-status';
import {
  IllegalArgumentException,
  IllegalStateException,
} from '@/common/exceptions/illegal-argument.exception';

describe('MemberTest', () => {
  it('createMember', () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = new Member('dongmin@test.com', 'dongmin', 'secret');

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);
  });

  it('constructorNullCheck', () => {
    // Then: 테스트 결과를 검증하는 단계
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new Member(null, 'dongmin', 'secret')).toThrow(
      IllegalArgumentException,
    );
  });

  it('activate', () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = new Member('dongmin@test.com', 'dongmin', 'secret');

    // When: 테스트를 진행하는 단계
    member.activate();

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.ACTIVE);
  });

  it('activateFail', () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = new Member('dongmin@test.com', 'dongmin', 'secret');

    // When: 테스트를 진행하는 단계
    member.activate();

    // Then: 테스트 결과를 검증하는 단계
    expect(() => member.activate()).toThrowError(IllegalStateException);
  });

  it('deactivate', () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = new Member('dongmin@test.com', 'dongmin', 'secret');
    member.activate();

    // When: 테스트를 진행하는 단계
    member.deactivate();

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.DEACTIVATED);
  });

  it('deactivateFail', () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = new Member('dongmin@test.com', 'dongmin', 'secret');

    // When: 테스트를 진행하는 단계

    // Then: 테스트 결과를 검증하는 단계
    expect(() => member.deactivate()).toThrowError(IllegalStateException);
    member.activate();
    member.deactivate();

    expect(() => member.deactivate()).toThrowError(IllegalStateException);
  });
});
