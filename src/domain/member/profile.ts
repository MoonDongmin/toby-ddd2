import { IllegalArgumentException } from '@/common/exceptions/illegal-argument.exception';

export class Profile {
  private readonly address: string;
  private static readonly PROFILE_ADDRESS_PATTERN: RegExp = /^[a-z0-9]+$/;

  constructor(address: string) {
    if (
      address === null ||
      (address.length >= 0 && !Profile.PROFILE_ADDRESS_PATTERN.test(address))
    ) {
      throw new IllegalArgumentException(
        '프로필 주소 형식이 바르지 않습니다: ' + address,
      );
    }

    if (address.length > 15) {
      throw new IllegalArgumentException(
        '프로필 주소는 최대 15자리를 넘을 수 없습니다.',
      );
    }

    this.address = address;
  }

  public getAddress(): string {
    return this.address;
  }

  public url(): string {
    return '@' + this.address;
  }
}
