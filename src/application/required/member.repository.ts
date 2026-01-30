import { Member } from '@/domain/member';
import { Email } from '@/domain/email';

/**
 * 회원 정보를 저장하거나 조회한다.
 */
export interface MemberRepository {
  save(member: Member): Promise<Member>;

  findByEmail(email: Email): Promise<Member | undefined>;
}

// export const MEMBER_REPOSITORY = Symbol('MemberRepository');
