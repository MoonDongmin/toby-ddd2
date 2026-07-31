import { Course } from '@/domain/course/course';
import { CourseCreateRequest } from '@/application/course/provided/course-create.request';
import { CourseInfoUpdateRequest } from '@/application/course/provided/course-info-update.request';

/**
 * 강의를 생성하는 작업
 */
export interface CourseStatus {
  create(createRequest: CourseCreateRequest): Promise<Course>;

  updateInfo(
    courseId: number,
    infoUpdateRequest: CourseInfoUpdateRequest,
  ): Promise<Course>;
}
