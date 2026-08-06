import { Member } from '@/domain/member/member';
import { MemberLoginRequest } from '@/application/member/provided/member-login.request';

/**
 * 회원 인증
 */
export interface MemberAuthenticator {
  /**
   * @throws {LoginFailedException} 이메일에 해당하는 회원이 없거나 비밀번호가 일치하지 않는 경우
   */
  login(loginRequest: MemberLoginRequest): Promise<Member>;
}

export const MEMBER_AUTHENTICATOR: symbol = Symbol('MemberAuthenticator');
