import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CourseUpdateInfo } from '@/domain/course/course-update-info';

@Entity()
export class CourseDetail {
  @PrimaryGeneratedColumn()
  private readonly id: number;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  private _description: string | null;

  @Column({ name: 'created_at', nullable: false })
  private readonly _createdAt: Date;

  @Column({ name: 'published_at', nullable: true })
  private _publishedAt: Date;

  @Column({ name: 'archived_at', nullable: true })
  private _archivedAt: Date;

  constructor(description: string | null) {
    this._description = description;
    this._createdAt = new Date();
  }

  public publish(): void {
    this._publishedAt = new Date();
  }

  public archive(): void {
    this._archivedAt = new Date();
  }

  public updateInfo(updateInfo: CourseUpdateInfo) {
    this._description = updateInfo.description;
  }

  public getDescription(): string | null {
    return this._description;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public getPublishedAt(): Date {
    return this._publishedAt;
  }

  public getArchivedAt(): Date {
    return this._archivedAt;
  }
}
