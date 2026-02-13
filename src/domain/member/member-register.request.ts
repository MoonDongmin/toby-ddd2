import { IsEmail, IsString, Length } from 'class-validator';

export class MemberRegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 20)
  nickname: string;

  @IsString()
  @Length(6, 100)
  password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
