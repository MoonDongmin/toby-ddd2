import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  MEMBER_REGISTER,
  type MemberRegister,
} from '@/application/member/provided/member-register';
import { MemberRegisterRequest } from '@/domain/member/member-register.request';
import { MemberRegisterResponse } from '@/adapter/webapi/dto/member-register.response';
import { Member } from '@/domain/member/member';

@Controller()
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
