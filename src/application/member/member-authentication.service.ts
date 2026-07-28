import { Inject } from '@nestjs/common';
import { ApplicationService } from '@/support/decorator/application-service.decorator';
import { MemberAuthenticator } from '@/application/member/provided/member-authenticator';
import { Member } from '@/domain/member/member';
import { LoginFailedException } from './provided/login-failed.exception';
import { MemberLoginRequest } from './provided/member-login.request';
import {
  MEMBER_REPOSITORY,
  type MemberRepository,
} from '@/application/member/required/member-repository';
import {
  PASSWORD_ENCODER,
  type PasswordEncoder,
} from '@/domain/member/password-encoder';
import { Email } from '@/domain/shared/email';

@ApplicationService()
export class MemberAuthenticationService implements MemberAuthenticator {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
    @Inject(PASSWORD_ENCODER)
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  async login(loginRequest: MemberLoginRequest): Promise<Member> {
    const member: Member | null = await this.memberRepository.findByEmail(
      new Email(loginRequest.email),
    );

    if (!member) {
      throw new LoginFailedException();
    }

    if (!member.isActive()) {
      throw new LoginFailedException();
    }

    if (!member.verifyPassword(loginRequest.password, this.passwordEncoder)) {
      throw new LoginFailedException();
    }

    return member;
  }
}
