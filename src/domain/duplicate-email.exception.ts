export class DuplicateEmailException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateEmailException';
  }
}
