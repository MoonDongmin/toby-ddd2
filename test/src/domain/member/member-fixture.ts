import { MemberRegisterRequest } from '@/application/member/provided/member-register.request';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import { Member } from '@/domain/member/member';
import { createInstance } from '../../../instancio';
import { faker } from '@faker-js/faker';

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

export function createMemberRegisterRequest(
  email: string = faker.internet.email(),
) {
  return createInstance(MemberRegisterRequest, { email });
}

export function createMember(id?: number): Member {
  if (id) {
    const member: Member = Member.register(
      createMemberRegisterRequest().toInfo(),
      createPasswordEncoder(),
    );

    member.setId(id);

    return member;
  }

  return Member.register(
    createMemberRegisterRequest().toInfo(),
    createPasswordEncoder(),
  );
}

export function createActiveMember(): Member {
  const member: Member = createMember();
  member.activate();

  return member;
}
