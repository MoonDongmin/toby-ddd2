import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';

export class Email {
  private readonly address: string;

  private static EMAIL_PATTERN: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;

  constructor(address: string) {
    if (!Email.EMAIL_PATTERN.test(address)) {
      throw new IllegalArgumentException(
        `이메일 형식이 바르지 않습니다: ${this.address}`,
      );
    }

    this.address = address;
  }
}
