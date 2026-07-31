import { Member } from '@/domain/member/member';
import { Instructor } from '@/domain/instructor/instructor';
import { createActiveMember } from '../member/member-fixture';
import { InstructorApplyRequest } from '@/application/instructor/provided/instructor-apply.request';

export class InstructorFixture {
  public static createInstructor(member?: Member): Instructor {
    return Instructor.apply(member ?? createActiveMember());
  }

  public static createActiveInstructor(member?: Member): Instructor {
    if (member) {
      const instructor: Instructor = this.createInstructor(member);
      instructor.approve();

      return instructor;
    }

    const instructor: Instructor = this.createInstructor();
    instructor.approve();
    return instructor;
  }

  public static createApplyRequest(member: Member): InstructorApplyRequest {
    return new InstructorApplyRequest(member.getId());
  }
}
