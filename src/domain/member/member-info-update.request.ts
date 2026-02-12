export class MemberInfoUpdateRequest {
  nickname: string;
  profileAddress: string;
  introduction: string;

  constructor(nickname: string, profileAddress: string, introduction: string) {
    this.nickname = nickname;
    this.profileAddress = profileAddress;
    this.introduction = introduction;
  }
}
