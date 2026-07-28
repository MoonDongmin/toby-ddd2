import { Inject } from '@nestjs/common';
import { ApplicationService } from '@/support/decorator/application-service.decorator';
import { InstructorFinder } from '@/application/instructor/provided/instructor-finder';
import { Instructor } from '@/domain/instructor/instructor';
import {
  INSTRUCTOR_REPOSITORY,
  type InstructorRepository,
} from '@/application/instructor/required/instructor-repository';
import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';

@ApplicationService()
export class InstructorQueryService implements InstructorFinder {
  constructor(
    @Inject(INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
  ) {}
  async find(instructorId: number): Promise<Instructor> {
    const instructor: Instructor | null =
      await this.instructorRepository.findById(instructorId);

    if (!instructor) {
      throw new IllegalArgumentException(
        `강사를 찾을 수 없습니다. ID: ${instructorId}`,
      );
    }

    return instructor;
  }

  findByMember(memberId: number): Promise<Instructor | null>;

  findByMember(memberId: number): Promise<Instructor | null>;

  findByMember(memberId: number): Promise<Instructor | null> {
    return this.instructorRepository.findByMemberId(memberId);
  }
}
