import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { User } from './user';
import { UserStatus } from './user-status';

/**
 * Instancio 의 `set()` / `ignore()` 로 지정할 수 있는 필드 목록에 해당한다.
 * User 는 private 필드 + getter 로만 이루어져 있어 생성 후 대입이 불가능하므로,
 * 오버라이드 값은 `build(params)` 가 아니라 `transient()` 로 생성자에 주입한다.
 */
export interface UserParams {
  id: number | null;
  name: string;
  email: string;
  status: UserStatus;
}

export const userFactory = Factory.define<User, UserParams>(
  ({ sequence, transientParams }) => {
    const {
      id = sequence,
      name = faker.person.fullName(),
      email = faker.internet.email(),
      status = faker.helpers.enumValue(UserStatus),
    } = transientParams;

    return new User(id, name, email, status);
  },
);
