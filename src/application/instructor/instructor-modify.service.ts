import { Inject, Injectable } from '@nestjs/common';
import { InstructorApplication } from '@/application/instructor/provided/instructor-application';
import { InstructorApplyRequest } from '@/application/instructor/provided/instructor-apply.request';
import { Instructor } from '@/domain/instructor/instructor';
import {
  INSTRUCTOR_REPOSITORY,
  type InstructorRepository,
} from '@/application/instructor/required/instructor-repository';
import {
  MEMBER_FINDER,
  type MemberFinder,
} from '@/application/member/provided/member-finder';
import {
  INSTRUCTOR_FINDER,
  type InstructorFinder,
} from '@/application/instructor/provided/instructor-finder';
import { Member } from '@/domain/member/member';
import { DuplicatedInstructorApplicationException } from '@/application/instructor/provided/duplicated-instructor-application.excpetion';

@Injectable()
export class InstructorModifyService implements InstructorApplication {
  constructor(
    @Inject(INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
    @Inject(INSTRUCTOR_FINDER)
    private readonly instructorFinder: InstructorFinder,
    @Inject(MEMBER_FINDER)
    private readonly memberFinder: MemberFinder,
  ) {}

  async apply(applyRequest: InstructorApplyRequest): Promise<Instructor> {
    const member: Member = await this.memberFinder.find(applyRequest.memberId);

    await this.checkDuplicateApplication(member);

    const instructor: Instructor = Instructor.apply(member);

    return this.instructorRepository.save(instructor);
  }

  private async checkDuplicateApplication(member: Member) {
    if (await this.instructorRepository.findByMemberId(member.getId())) {
      throw new DuplicatedInstructorApplicationException(
        '회원은 중복해서 강사 신청을 할 수 없습니다.',
      );
    }
  }

  async approve(instructorId: number): Promise<Instructor> {
    const instructor: Instructor =
      await this.instructorFinder.find(instructorId);

    instructor.approve();

    return await this.instructorRepository.save(instructor);
  }

  async reject(instructorId: number): Promise<Instructor> {
    const instructor: Instructor =
      await this.instructorFinder.find(instructorId);

    instructor.reject();

    return await this.instructorRepository.save(instructor);
  }
}
