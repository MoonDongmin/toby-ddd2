import { Email } from '@/domain/email';

describe('EmailTest', () => {
  it('equality', () => {
    // Given: 테스트 실행을 준비하는 단계
    const email1: Email = new Email('sit@test.com');
    const email2: Email = new Email('sit@test.com');

    // Then: 테스트 결과를 검증하는 단계
    expect(email1).toEqual(email2);
  });
});
