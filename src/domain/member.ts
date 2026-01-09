import { MemberStatus } from '@/domain/member-status';
import { Assert } from '@/common/util/assert';
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';
import { PasswordEncoder } from '@/domain/password-encoder';

export class Member {
  private email: NonNullable<string>;

  private nickname: NonNullable<string>;

  private passwordHash: NonNullable<string>;

  private status: MemberStatus;

  private constructor(
    email: NonNullable<string>,
    nickname: NonNullable<string>,
    passwordHash: NonNullable<string>,
  ) {
    if (
      email === undefined ||
      email === null ||
      nickname === undefined ||
      nickname === null ||
      passwordHash === undefined ||
      passwordHash === null
    ) {
      throw new IllegalArgumentException('Invalid member properties');
    }

    this.email = email;
    this.nickname = nickname;
    this.passwordHash = passwordHash;

    this.status = MemberStatus.PENDING;
  }

  public static create(
    email: string,
    nickname: string,
    password: string,
    passwordEncoder: PasswordEncoder,
  ) {
    return new Member(email, nickname, passwordEncoder.encode(password));
  }

  public activate(): void {
    Assert.state(
      this.status === MemberStatus.PENDING,
      `PENDING 상태가 아닙니다`,
    );

    this.status = MemberStatus.ACTIVE;
  }

  public deactivate(): void {
    Assert.state(this.status === MemberStatus.ACTIVE, `ACTIVE 상태가 아닙니다`);

    this.status = MemberStatus.DEACTIVATED;
  }

  public verifyPassword(
    password: string,
    passwordEncoder: PasswordEncoder,
  ): boolean {
    return passwordEncoder.matches(password, this.passwordHash);
  }

  public changeNickname(nickname: string) {
    this.nickname = nickname;
  }

  public changePassword(password: string, passwordEncoder: PasswordEncoder) {
    this.passwordHash = passwordEncoder.encode(password);
  }

  public getEmail(): string {
    return this.email;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getStatus(): MemberStatus {
    return this.status;
  }
}
