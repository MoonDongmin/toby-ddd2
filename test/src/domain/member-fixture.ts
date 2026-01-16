import { MemberRegisterRequest } from '@/domain/member-register.request';
import { PasswordEncoder } from '@/domain/password-encoder';

export function createPasswordEncoder(): PasswordEncoder {
  return {
    encode(password: string) {
      return password.toUpperCase();
    },
    matches(password: string, passwordHash: string) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      return this.encode(password) === passwordHash;
    },
  };
}

export function createMemberRegisterRequest(email?: string) {
  if (email) {
    return new MemberRegisterRequest(email, 'dongmin', 'secret');
  }

  return new MemberRegisterRequest('dongmin@test.com', 'dongmin', 'secret');
}
