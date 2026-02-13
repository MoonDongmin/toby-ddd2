import { MemberRegisterRequest } from '@/domain/member/member-register.request';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import { Member } from '@/domain/member/member';

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
  return new MemberRegisterRequest(
    email ? email : 'dongmin@naver.com',
    'Dongmin',
    'secret',
  );
}

export function createMember(id?: number): Member {
  if (id) {
    const member: Member = Member.register(
      createMemberRegisterRequest(),
      createPasswordEncoder(),
    );

    member.setId(id);

    return member;
  }

  return Member.register(
    createMemberRegisterRequest(),
    createPasswordEncoder(),
  );
}
