import { Member } from '@/domain/member/member';

/*
 회원을 조회한다
 */
export interface MemberFinder {
  find(memberId: number): Promise<Member>;
}

export const MEMBER_FINDER: symbol = Symbol('MemberFinder');
