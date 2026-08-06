import { IsEmail, Length } from 'class-validator';

export class UserRegisterRequest {
  @IsEmail()
  readonly email: string;

  @Length(5, 20)
  readonly nickname: string;

  @Length(8, 100)
  readonly password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
