import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Assert } from '@/common/util/assert';
import { Profile } from '@/domain/member/profile';
import { MemberInfoUpdateRequest } from '@/domain/member/member-info-update.request';

@Entity()
export class MemberDetail {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({
    name: 'profile_address',
    type: 'varchar',
    nullable: true,
    transformer: {
      to: (value: Profile | null) => (value ? value.getAddress() : null),
      from: (value: string | null) => (value ? new Profile(value) : null),
    },
    unique: true,
    length: 20,
  })
  private profile: Profile;

  @Column({ nullable: true })
  private introduction: string;

  @Column({ nullable: false })
  private registeredAt: Date;

  @Column({ nullable: true })
  private activatedAt: Date;

  @Column({ nullable: true })
  private deactivatedAt: Date;

  public static create(): MemberDetail {
    const memberDetail: MemberDetail = new MemberDetail();
    memberDetail.registeredAt = new Date();
    return memberDetail;
  }

  public getId(): number {
    return this.id;
  }

  public getProfile(): Profile {
    return this.profile;
  }

  public getIntroduction(): string {
    return this.introduction;
  }

  public getRegisteredAt(): Date {
    return this.registeredAt;
  }

  public getActivatedAt(): Date {
    return this.activatedAt;
  }

  public getDeactivatedAt(): Date {
    return this.deactivatedAt;
  }

  activate(): void {
    Assert.isTrue(
      this.activatedAt === null || this.activatedAt === undefined,
      '이미 activatedAt가 설정되었습니다',
    );

    this.activatedAt = new Date();
  }

  deactivate(): void {
    Assert.isTrue(
      this.deactivatedAt === null || this.deactivatedAt === undefined,
      '이미 deactivatedAt가 설정되었습니다',
    );

    this.deactivatedAt = new Date();
  }

  updateInfo(updateRequest: MemberInfoUpdateRequest): void {
    this.profile = new Profile(updateRequest.profileAddress);

    this.introduction = updateRequest.introduction!;
  }
}
