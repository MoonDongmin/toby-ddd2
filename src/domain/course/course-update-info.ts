import { IsNotEmpty, Length } from 'class-validator';

export class CourseUpdateInfo {
  @Length(2, 100)
  title: string;

  @IsNotEmpty()
  description: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}
