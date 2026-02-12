import { Member } from '@/domain/member/member';
import { Email } from '@/domain/shared/email';

/**
 * 회원 정보를 저장하거나 조회한다.
 */
export interface MemberRepository {
  save(member: Member): Promise<Member>;

  findByEmail(email: Email): Promise<Member | null>;

  findById(memberId: number): Promise<Member | null>;
}

export const MEMBER_REPOSITORY: symbol = Symbol('MemberRepository');
