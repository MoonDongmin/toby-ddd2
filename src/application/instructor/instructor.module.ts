import { Module } from '@nestjs/common';
import { InstructorModifyService } from '@/application/instructor/instructor-modify.service';
import { InstructorQueryService } from '@/application/instructor/instructor-query.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from '@/domain/instructor/instructor';
import { INSTRUCTOR_FINDER } from '@/application/instructor/provided/instructor-finder';
import { INSTRUCTOR_REPOSITORY } from '@/application/instructor/required/instructor-repository';
import { InstructorRepositoryImpl } from '@/adapter/persistence/instructor-repository-impl';
import { MemberModule } from '@/application/member/member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), MemberModule],
  providers: [
    InstructorModifyService,
    InstructorQueryService,
    {
      provide: INSTRUCTOR_FINDER,
      useClass: InstructorQueryService,
    },
    {
      provide: INSTRUCTOR_REPOSITORY,
      useClass: InstructorRepositoryImpl,
    },
  ],
  exports: [InstructorModifyService],
})
export class InstructorModule {}
