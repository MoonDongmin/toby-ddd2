import { Email } from '@/domain/shared/email';
import { PasswordEncoder } from '@/domain/member/password-encoder';
import { createPasswordEncoder } from './src/domain/member/member-fixture';
import { Member } from '@/domain/member/member';

export class SplearnTestConfiguration {
  private savedMembers: Map<string, Member> = new Map<string, Member>();
  private idCounter: number = 1;

  emailSender() {
    return {
      send: (email: Email, subject: string, body: string): void => {
        console.log(
          `To: ${email.getAddress()}, Subject: ${subject}, Body: ${body}`,
        );
      },
    };
  }

  passwordEncoder(): PasswordEncoder {
    return createPasswordEncoder();
  }

  memberRepository() {
    return {
      save: async (member: Member): Promise<Member> => {
        member.setId(this.idCounter++);
        this.savedMembers.set(member.getEmail().getAddress(), member);
        return member;
      },
      findByEmail: async (email: Email): Promise<Member | undefined> => {
        return this.savedMembers.get(email.getAddress());
      },
    };
  }

  resetMemberRepository() {
    this.savedMembers.clear();
    this.idCounter = 1;
  }
}
