import { IsEmail, Length } from 'class-validator';

export class MemberLoginRequest {
  @IsEmail()
  email: string;

  @Length(8, 100)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
