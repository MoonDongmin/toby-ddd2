import { Body, Inject, Post } from '@nestjs/common';
import { WebApiAdapter } from '@/support/decorator/web-api-adapter.decorator';
import {
  MEMBER_REGISTER,
  type MemberRegister,
} from '@/application/member/provided/member-register';
import { MemberRegisterRequest } from '@/application/member/provided/member-register.request';
import { MemberRegisterResponse } from '@/adapter/webapi/dto/member-register.response';
import { Member } from '@/domain/member/member';

@WebApiAdapter()
export class MemberController {
  constructor(
    @Inject(MEMBER_REGISTER)
    private readonly memberRegister: MemberRegister,
  ) {}

  @Post('/api/members')
  async register(
    @Body() request: MemberRegisterRequest,
  ): Promise<MemberRegisterResponse> {
    const member: Member = await this.memberRegister.register(request);

    return MemberRegisterResponse.of(member);
  }
}
