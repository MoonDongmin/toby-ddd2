import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '@/domain/course/course';
import { COURSE_REPOSITORY } from '@/application/course/required/course-repository';
import { CourseRepositoryImpl } from '@/adapter/persistence/course-repository-impl';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseRepositoryImpl,
    },
  ],
})
export class CourseModule {}
