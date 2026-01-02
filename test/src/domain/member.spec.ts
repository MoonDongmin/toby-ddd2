import { Member } from '@/domain/member';
import { MemberStatus } from '@/domain/member-status';

describe('MemberTest', () => {
  it('createMember', () => {
    // Given: 테스트 실행을 준비하는 단계
    const member: Member = new Member('dongmin@test.com', 'dongmin', 'secret');

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);
  });
});
