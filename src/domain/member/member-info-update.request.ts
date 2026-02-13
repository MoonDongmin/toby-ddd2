import { IsNotEmpty, IsString, Length } from 'class-validator';

export class MemberInfoUpdateRequest {
  @IsString()
  @Length(5, 20)
  nickname: string;

  @IsString()
  @Length(0, 15)
  @IsNotEmpty()
  profileAddress: string;

  @IsString()
  @IsNotEmpty()
  introduction: string;

  constructor(nickname: string, profileAddress: string, introduction: string) {
    this.nickname = nickname;
    this.profileAddress = profileAddress;
    this.introduction = introduction;
  }
}
