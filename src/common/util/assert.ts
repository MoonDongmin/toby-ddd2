import { IllegalStateException } from '@/common/exceptions/illegal-argument.exception';

export class Assert {
  static state(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new IllegalStateException(message);
    }
  }

  static hasText(
    value: string | null | undefined,
    message: string,
  ): asserts value is string {
    if (!value || value.trim().length === 0) {
      throw new Error(message);
    }
  }
}
