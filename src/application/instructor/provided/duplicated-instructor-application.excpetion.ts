export class DuplicatedInstructorApplicationException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'DuplicatedInstructorApplicationException';
  }
}
