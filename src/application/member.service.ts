import { MemberRegister } from '@/application/provided/member-register';
import { MemberRegisterRequest } from '@/domain/member-register.request';
import { Member } from '@/domain/member';
import { Inject, Injectable } from '@nestjs/common';
import { type EmailSender } from '@/application/required/email-sender';
import { type PasswordEncoder } from '@/domain/password-encoder';
import { type MemberRepository } from '@/application/required/member-repository';
import { Email } from '@/domain/email';
import { DuplicateEmailException } from '@/domain/duplicate-email.exception';

@Injectable()
export class MemberService implements MemberRegister {
  constructor(
    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepository: MemberRepository,
    @Inject('EMAIL_SENDER')
    private readonly emailSender: EmailSender,
    @Inject('PASSWORD_ENCODER')
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async register(
    memberRegisterRequest: MemberRegisterRequest,
  ): Promise<Member> {
    await this.checkDuplicateEmail(memberRegisterRequest);

    const member: Member = Member.register(
      memberRegisterRequest,
      this.passwordEncoder,
    );

    await this.memberRepository.save(member);

    this.sendWelcomeEmail(member);

    return member;
  }

  private sendWelcomeEmail(member: Member) {
    this.emailSender.send(
      member.getEmail(),
      '등록을 완료해주세요',
      '아래 링크를 클릭해서 등록을 완료해주세요',
    );
  }

  private async checkDuplicateEmail(
    memberRegisterRequest: MemberRegisterRequest,
  ) {
    const memberExist: Member | null = await this.memberRepository.findByEmail(
      new Email(memberRegisterRequest.email),
    );

    if (memberExist) {
      throw new DuplicateEmailException(
        '이미 사용중인 이메일입니다: ' + memberRegisterRequest.email,
      );
    }
  }
}
