import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Instructor } from '@/domain/instructor/instructor';
import { CourseStatus } from '@/domain/course/course-status';
import { CourseDetail } from '@/domain/course/course-detail';
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';
import { Assert } from '@/common/util/assert';
import { CourseUpdateInfo } from '@/domain/course/course-update-info';

@Entity()
export class Course {
  @PrimaryGeneratedColumn({ name: 'id' })
  private readonly _id: number;

  @ManyToOne(() => Instructor, { nullable: false, eager: false })
  @JoinColumn({ name: 'instructor_id' })
  private readonly _instructor: Instructor;

  @Column({ name: 'title', nullable: false, length: 100 })
  _title: string;

  @Column({
    name: 'status',
    nullable: false,
    type: 'enum',
    enum: CourseStatus,
  })
  private _status: CourseStatus;

  @OneToOne(() => CourseDetail, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'detail_id' })
  private readonly _detail: CourseDetail;

  constructor(
    instructor: Instructor,
    title: string,
    description: string | null,
  ) {
    if (!instructor || !title || instructor.ensureActive()) {
      throw new IllegalArgumentException('Invalid course properties');
    }

    this._instructor = instructor;
    this._title = title;
    this._status = CourseStatus.DRAFT;

    this._detail = new CourseDetail(description);
  }

  public submitForReview(): void {
    Assert.state(this._status === CourseStatus.DRAFT, 'DRAFT 상태가 아닙니다.');
    Assert.state(
      !!this._detail.getDescription()?.trim(),
      '강의 소개가 등록되지 않았습니다.',
    );

    this._status = CourseStatus.IN_REVIEW;
  }

  public publish(): void {
    Assert.state(
      this._status === CourseStatus.IN_REVIEW,
      'IN_REVIEW 상태가 아닙니다.',
    );

    this._status = CourseStatus.PUBLISHED;
    this._detail.publish();
  }

  public archive(): void {
    Assert.state(
      this._status === CourseStatus.PUBLISHED,
      'PUBLISHED 상태가 아닙니다.',
    );

    this._status = CourseStatus.ARCHIVED;
    this._detail.archive();
  }

  public isPublished(): boolean {
    return this._status === CourseStatus.PUBLISHED;
  }

  public ensurePublished(): void {
    Assert.state(
      this._status === CourseStatus.PUBLISHED,
      'PUBLISHED 상태가 아닙니다.',
    );
  }

  public updateInfo(updateInfo: CourseUpdateInfo): void {
    this._title = updateInfo.title;
    this._detail.updateInfo(updateInfo);
  }

  public getId(): number {
    return this._id;
  }

  public getInstructor(): Instructor {
    return this._instructor;
  }

  public getTitle(): string {
    return this._title;
  }

  public getStatus(): CourseStatus {
    return this._status;
  }

  public getDetail(): CourseDetail {
    return this._detail;
  }
}
