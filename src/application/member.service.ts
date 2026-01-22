import { MemberRegister } from '@/application/provided/member-register';
import { MemberRegisterRequest } from '@/domain/member-register.request';
import { Member } from '@/domain/member';
import { Injectable } from '@nestjs/common';
import { type EmailSender } from '@/application/required/email-sender';
import { type PasswordEncoder } from '@/domain/password-encoder';
import { type MemberRepository } from '@/application/required/member.repository';

@Injectable()
export class MemberService implements MemberRegister {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly emailSender: EmailSender,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async register(
    memberRegisterRequest: MemberRegisterRequest,
  ): Promise<Member> {
    // check

    const member: Member = Member.register(
      memberRegisterRequest,
      this.passwordEncoder,
    );

    await this.memberRepository.save(member);

    this.emailSender.send(
      member.getEmail(),
      '등록을 완료해주세요',
      '아래 링크를 클릭해서 등록을 완료해주세요',
    );

    return member;
  }
}
