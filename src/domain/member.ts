import { MemberStatus } from '@/domain/member-status';
import { Assert } from '@/common/util/assert';
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';
import { PasswordEncoder } from '@/domain/password-encoder';
import { MemberRegisterRequest } from '@/domain/member-register.request';
import { Email } from '@/domain/email';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({
    type: 'varchar',
    name: 'email_address',
    transformer: {
      to: (email: Email) => (email ? email.getAddress() : null),
      from: (email: string) => (email ? new Email(email) : null),
    },
    unique: true,
    length: 150,
    nullable: false,
  })
  private email: Email;

  @Column({
    length: 100,
    nullable: false,
  })
  private nickname: string;

  @Column({
    name: 'password_hash',
    length: 200,
    nullable: false,
  })
  private passwordHash: string;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.PENDING,
    nullable: false,
  })
  private status: MemberStatus;

  private constructor() {}

  public static register(
    createRequest: MemberRegisterRequest,
    passwordEncoder: PasswordEncoder,
  ): Member {
    if (
      createRequest.email === undefined ||
      createRequest.email === null ||
      createRequest.nickname === undefined ||
      createRequest.nickname === null ||
      createRequest.password === undefined ||
      createRequest.password === null
    ) {
      throw new IllegalArgumentException('Invalid member properties');
    }
    const member: Member = new Member();

    member.email = new Email(createRequest.email);
    member.nickname = createRequest.nickname;
    member.passwordHash = passwordEncoder.encode(createRequest.password);

    member.status = MemberStatus.PENDING;

    return member;
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

  public changePassword(
    password: NonNullable<string>,
    passwordEncoder: PasswordEncoder,
  ) {
    this.passwordHash = passwordEncoder.encode(password);
  }

  public isActive(): boolean {
    return this.status === MemberStatus.ACTIVE;
  }

  public getEmail(): Email {
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

  public getId(): number {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }
}
