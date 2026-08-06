import { Member } from '@/domain/member/member';
import { createActiveMember, createMember } from '../member/member-fixture';
import { Instructor } from '@/domain/instructor/instructor';
import { InstructorStatus } from '@/domain/instructor/instructor-status.enum';
import { IllegalStateException } from '@/common/exceptions/illegal-argument.exception';
import { InstructorFixture } from './instructor-fixture';

describe('InstructorTest', () => {
  it('apply', () => {
    const member: Member = createActiveMember();

    const instructor: Instructor = Instructor.apply(member);

    expect(instructor.member).toEqual(member);
    expect(instructor.status).toEqual(InstructorStatus.PENDING);
  });

  it('applyFailedMemberNotActivate', () => {
    const member: Member = createMember(); // PENDING

    expect(() => Instructor.apply(member)).toThrow(IllegalStateException);
  });

  it('approve', () => {
    const instructor: Instructor = InstructorFixture.createInstructor();

    instructor.approve();

    expect(instructor.status).toEqual(InstructorStatus.ACTIVE);
  });

  it('approveFailed', () => {
    const instructor: Instructor = InstructorFixture.createActiveInstructor();

    expect(() => instructor.approve()).toThrow(IllegalStateException);
  });

  it('reject', () => {
    const instructor: Instructor = InstructorFixture.createInstructor();

    instructor.reject();

    expect(instructor.status).toEqual(InstructorStatus.REJECTED);
  });

  it('rejectFailed', () => {
    const instructor: Instructor = InstructorFixture.createInstructor();

    instructor.reject();

    expect(() => instructor.reject()).toThrow(IllegalStateException);
  });

  it('isActive', () => {
    const member: Member = createActiveMember();
    const instructor: Instructor = Instructor.apply(member);

    expect(instructor.isActive()).toBeFalsy();

    instructor.approve();
    expect(instructor.isActive()).toBeTruthy();
  });

  it('ensureActive', () => {
    const member: Member = createActiveMember();
    const instructor: Instructor = Instructor.apply(member);

    expect(() => instructor.ensureActive()).toThrow(IllegalStateException);

    instructor.approve();

    instructor.ensureActive();
  });
});
