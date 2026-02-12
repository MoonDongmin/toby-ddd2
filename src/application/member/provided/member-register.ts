import { MemberRegisterRequest } from '@/domain/member/member-register.request';
import { Member } from '@/domain/member/member';

/**
 * 회원의 등록과 관련된 기능을 제공한다
 */
export interface MemberRegister {
  register(memberRegisterRequest: MemberRegisterRequest): Promise<Member>;

  activate(memberId: number): Promise<Member>;
}

export const MEMBER_REGISTER: symbol = Symbol('MemberRegister');
