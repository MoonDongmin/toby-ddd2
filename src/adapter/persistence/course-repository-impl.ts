import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CourseRepository } from '@/application/course/required/course-repository';
import { Course } from '@/domain/course/course';
import { Instructor } from '@/domain/instructor/instructor';

@Injectable()
export class CourseRepositoryImpl implements CourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async save(course: Course): Promise<Course> {
    return this.courseRepository.save(course);
  }

  async findById(id: number): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { _id: id },
      relations: { _instructor: { _member: true } },
    } as any);
  }

  async findByTitleContaining(keyword: string): Promise<Course[]> {
    return this.courseRepository.findBy({
      _title: Like(`%${keyword}%`),
    } as any);
  }

  async findByInstructor(instructor: Instructor): Promise<Course[]> {
    return this.findByInstructorId(instructor.id);
  }

  async findByInstructorId(instructorId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { _instructor: { _id: instructorId } },
      relations: { _instructor: { _member: true } },
    } as any);
  }
}
