import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export class CourseCreateRequest {
  @IsNotEmpty()
  instructorId: number;

  @Length(2, 100)
  title: string;

  @MaxLength(500)
  description: string;

  constructor(instructorId: number, title: string, description: string) {
    this.instructorId = instructorId;
    this.title = title;
    this.description = description;
  }
}
