import { Member } from '@/domain/member';
import { Inject, Injectable } from '@nestjs/common';
import {
  MEMBER_REPOSITORY,
  type MemberRepository,
} from '@/application/required/member-repository';
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';
import { MemberFinder } from '@/application/provided/member-finder';

@Injectable()
export class MemberQueryService implements MemberFinder {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}

  async find(memberId: number): Promise<Member> {
    const member: Member | null =
      await this.memberRepository.findById(memberId);

    if (!member) {
      throw new IllegalArgumentException(
        `회원을 찾을 수 없습니다. id: ${memberId}`,
      );
    }

    return member;
  }
}
