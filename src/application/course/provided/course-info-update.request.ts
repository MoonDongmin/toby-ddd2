import { Length, MaxLength } from 'class-validator';

export class CourseInfoUpdateRequest {
  @Length(2, 100)
  title: string;

  @MaxLength(500)
  description: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}
