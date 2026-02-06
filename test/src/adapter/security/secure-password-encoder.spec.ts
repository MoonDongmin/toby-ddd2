import { SecurePasswordEncoder } from '@/adapter/security/secure-password-encoder';

describe('SecurePasswordEncoderTest', () => {
  it('securePasswordEncoder', () => {
    // Given: 테스트 실행을 준비하는 단계
    const securePasswordEncoder: SecurePasswordEncoder =
      new SecurePasswordEncoder();

    // When: 테스트를 진행하는 단계
    const passwordHash: string = securePasswordEncoder.encode('secret');

    // Then: 테스트 결과를 검증하는 단계
    expect(securePasswordEncoder.matches('secret', passwordHash)).toBeTruthy();
    expect(securePasswordEncoder.matches('wrong', passwordHash)).toBeFalsy();
  });
});
