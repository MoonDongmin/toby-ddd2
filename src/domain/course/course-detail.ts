import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CourseDetail {
  @PrimaryGeneratedColumn()
  private readonly id: number;

  @Column({ length: 500 })
  private readonly _description: string | null;

  @Column()
  private readonly _createdAt: Date;

  @Column()
  private _publishedAt: Date;

  @Column()
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
