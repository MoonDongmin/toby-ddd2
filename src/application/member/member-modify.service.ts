import { MemberRegister } from '@/application/member/provided/member-register';
import { MemberRegisterRequest } from '@/domain/member/member-register.request';
import { Member } from '@/domain/member/member';
import { Inject, Injectable } from '@nestjs/common';
import {
  EMAIL_SENDER,
  type EmailSender,
} from '@/application/member/required/email-sender';
import {
  PASSWORD_ENCODER,
  type PasswordEncoder,
} from '@/domain/member/password-encoder';
import {
  MEMBER_REPOSITORY,
  type MemberRepository,
} from '@/application/member/required/member-repository';
import { Email } from '@/domain/shared/email';
import { DuplicateEmailException } from '@/domain/member/duplicate-email.exception';
import {
  MEMBER_FINDER,
  type MemberFinder,
} from '@/application/member/provided/member-finder';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update.request';

@Injectable()
export class MemberModifyService implements MemberRegister {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
    @Inject(EMAIL_SENDER)
    private readonly emailSender: EmailSender,
    @Inject(PASSWORD_ENCODER)
    private readonly passwordEncoder: PasswordEncoder,
    @Inject(MEMBER_FINDER)
    private readonly memberFinder: MemberFinder,
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
  async activate(memberId: number): Promise<Member> {
    const member: Member | null = await this.memberFinder.find(memberId);

    member.activate();

    return this.memberRepository.save(member);
  }

  async deactivate(memberId: number): Promise<Member> {
    const member: Member | null = await this.memberFinder.find(memberId);

    member.deactivate();

    return this.memberRepository.save(member);
  }

  async updateInfo(
    memberId: number,
    memberInfoUpdateRequest: MemberInfoUpdateRequest,
  ): Promise<Member> {
    const member: Member | null = await this.memberFinder.find(memberId);

    member.updateInfo(memberInfoUpdateRequest);

    return this.memberRepository.save(member);
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
