export class MemberRegisterRequest {
  email: string;

  nickname: string;

  password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
