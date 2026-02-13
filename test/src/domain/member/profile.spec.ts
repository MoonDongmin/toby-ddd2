import { Profile } from '@/domain/member/profile';

describe('ProfileTest', () => {
  it('profile', () => {
    new Profile('tobyliee');
    new Profile('toby100');
    new Profile('toby12345');
    new Profile('');
  });

  it('profileFail', () => {
    expect(() => new Profile('asfdasdfasdfasdfasdfasdfasdfasdf')).toThrow();
    expect(() => new Profile('A')).toThrow();
    expect(() => new Profile('프로필')).toThrow();
  });
});
