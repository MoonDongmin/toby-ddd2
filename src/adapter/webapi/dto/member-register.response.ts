import { Member } from '@/domain/member/member';
import { IsEmail } from 'class-validator';

export class MemberRegisterResponse {
  memberId: number;

  @IsEmail()
  email: string;

  constructor(memberId: number, email: string) {
    this.memberId = memberId;
    this.email = email;
  }

  public static of(member: Member) {
    return new MemberRegisterResponse(
      member.getId(),
      member.getEmail().getAddress(),
    );
  }
}
