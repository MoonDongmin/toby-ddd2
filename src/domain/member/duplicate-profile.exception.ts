export class DuplicateProfileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateProfileException';
  }
}
