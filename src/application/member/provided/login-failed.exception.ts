export class LoginFailedException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'LoginFailedException';
  }
}
