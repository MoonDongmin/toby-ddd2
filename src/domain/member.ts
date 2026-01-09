import { MemberStatus } from '@/domain/member-status';
import { Assert } from '@/common/util/assert';
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';

export class Member {
  private readonly email: string;

  private readonly nickname: string;

  private readonly passwordHash: string;

  private status: MemberStatus;

  constructor(email: string, nickname: string, passwordHash: string) {
    if (!email || !nickname || !passwordHash) {
      throw new IllegalArgumentException('Invalid member properties');
    }

    this.email = email;
    this.nickname = nickname;
    this.passwordHash = passwordHash;

    this.status = MemberStatus.PENDING;
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
