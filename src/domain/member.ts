import { MemberStatus } from '@/domain/member-status';

export class Member {
  private readonly _email!: string;

  private readonly _nickname!: string;

  private readonly _passwordHash!: string;

  private readonly _status!: MemberStatus;

  constructor(email: string, nickname: string, passwordHash: string) {
    this._email = email;
    this._nickname = nickname;
    this._passwordHash = passwordHash;
    this._status = MemberStatus.PENDING;
  }

  public getEmail(): string {
    return this._email;
  }

  public getNickname(): string {
    return this._nickname;
  }

  public getPasswordHash(): string {
    return this._passwordHash;
  }

  public getStatus(): MemberStatus {
    return this._status;
  }
}
