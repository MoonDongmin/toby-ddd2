import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member/member';
import { MemberModule } from '@/application/member/member.module';
import { MemberDetail } from '@/domain/member/member-detail';
import { ApiControllerAdvice } from '@/adapter/api-controller-advice';
import { InstructorModule } from '@/application/instructor/instructor.module';
import { Instructor } from '@/domain/instructor/instructor';
import { CourseModule } from '@/application/course/course.module';
import { Course } from '@/domain/course/course';
import { CourseDetail } from '@/domain/course/course-detail';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Member, MemberDetail, Instructor, Course, CourseDetail],
      // TypeORM이 엔티티를 하이드레이션할 때 생성자를 호출하지 않도록 한다.
      // (인자 검증이 있는 Course 생성자가 no-arg 호출로 깨지는 것을 방지)
      entitySkipConstructor: true,
      synchronize: true,
      // dropSchema: true,
    }),
    MemberModule,
    InstructorModule,
    CourseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: ApiControllerAdvice,
    },
  ],
})
export class AppModule {}
