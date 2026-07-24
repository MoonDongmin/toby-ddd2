import { IsNotEmpty } from 'class-validator';

export class InstructorApplyRequest {
  @IsNotEmpty()
  memberId: number;

  constructor(memberId: number) {
    this.memberId = memberId;
  }
}
