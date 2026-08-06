import 'reflect-metadata';
import { validate } from 'class-validator';
import { userFactory } from './user.factory';
import { UserStatus } from './user-status';
import { User } from './user';
import { Factory } from 'fishery';
import { createInstance } from '../../instancio';
import { UserRegisterRequest } from './user-register.request';

describe('InstancioLearningTest', () => {
  it('user', () => {
    const user = userFactory
      .transient({
        id: null, // .ignore(field(User::getId))
        status: UserStatus.PENDING, // .set(field(User::getStatus), UserStatus.PENDING)
      })
      .build(); // .create()

    expect(user.id).toBeNull();
    expect(user.email).not.toHaveLength(0);
    expect(user.name).not.toHaveLength(0);
    expect(user.status).toBe(UserStatus.PENDING);
  });

  it('userModel', () => {
    const model: Factory<User> = userFactory.transient({
      id: null,
      status: UserStatus.PENDING,
    });

    for (let i = 0; i < 100; i++) {
      const user: User = model.build();

      expect(user.id).toBeNull();
      expect(user.email).not.toHaveLength(0);
      expect(user.name).not.toHaveLength(0);
      expect(user.status).toBe(UserStatus.PENDING);
    }
  });

  it('annotation', () => {
    const userRegisterRequest: UserRegisterRequest =
      createInstance(UserRegisterRequest);

    expect(userRegisterRequest.email).not.toHaveLength(0);
    expect(userRegisterRequest.nickname).not.toHaveLength(0);
    expect(userRegisterRequest.password.length).toBeGreaterThanOrEqual(8);
    expect(userRegisterRequest.password.length).toBeLessThanOrEqual(100);
  });
});
