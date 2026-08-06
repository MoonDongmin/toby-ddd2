import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '@/domain/member/member';
import { InstructorStatus } from '@/domain/instructor/instructor-status.enum';
import { Assert } from '@/common/util/assert';

@Entity()
export class Instructor {
  @PrimaryGeneratedColumn({ name: 'id' })
  private _id: number;

  @OneToOne(() => Member, { eager: false })
  @JoinColumn({ name: 'member_id' })
  private _member: Member;

  @Column({
    name: 'status',
    type: 'enum',
    enum: InstructorStatus,
  })
  private _status: InstructorStatus;

  private constructor() {}

  public static apply(member: Member): Instructor {
    Assert.state(
      member.isActive(),
      '등록 완료 상태가 아닌 회원은 강사 신청을 할 수 없습니다.',
    );

    const instructor: Instructor = new Instructor();
    instructor._member = member;
    instructor._status = InstructorStatus.PENDING;

    return instructor;
  }

  public approve(): void {
    Assert.state(
      this._status === InstructorStatus.PENDING,
      '강사의 상태가 PENDING이 아닙니다.',
    );

    this._status = InstructorStatus.ACTIVE;
  }

  public reject(): void {
    Assert.state(
      this._status === InstructorStatus.PENDING,
      '강사의 상태가 PENDING이 아닙니다.',
    );

    this._status = InstructorStatus.REJECTED;
  }

  public isActive(): boolean {
    return this._status === InstructorStatus.ACTIVE;
  }

  public ensureActive(): void {
    Assert.state(this.isActive(), 'ACTIVE 상태가 아닙니다.');
  }

  public get id(): number {
    return this._id;
  }

  public get member(): Member {
    return this._member;
  }

  public get status(): InstructorStatus {
    return this._status;
  }
}
