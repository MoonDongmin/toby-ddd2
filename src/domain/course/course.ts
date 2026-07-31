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

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  private readonly _id: number;

  @ManyToOne(() => Instructor, { nullable: false, eager: false })
  @JoinColumn({ name: 'instructor_id' })
  private readonly _instructor: Instructor;

  @Column({ nullable: false, length: 100 })
  _title: string;

  @Column({ nullable: false, type: 'enum', enum: CourseStatus, length: 20 })
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
