export class IllegalArgumentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalArgumentException';
  }
}

export class IllegalStateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IllegalStateException';
  }
}
