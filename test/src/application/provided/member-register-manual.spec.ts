import { Member } from '@/domain/member';
import { MemberRegister } from '@/application/provided/member-register';
import { MemberService } from '@/application/member.service';
import {
  createMemberRegisterRequest,
  createPasswordEncoder,
} from '../../domain/member-fixture';
import { MemberRepository } from '@/application/required/member.repository';
import { EmailSender } from '@/application/required/email-sender';
import { Email } from '@/domain/email';
import { MemberStatus } from '@/domain/member-status';

describe('MemberRegisterTest', () => {
  it('register', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const register: MemberRegister = new MemberService(
      new MemberRepositoryStub(),
      new EmailSenderStub(),
      createPasswordEncoder(),
    );

    // When: 테스트를 진행하는 단계
    const member: Member = await register.register(
      createMemberRegisterRequest(),
    );

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getId()).toBeDefined();
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);
  });

  it('registerTestMock', async () => {
    // Given: 테스트 실행을 준비하는 단계
    const emailSenderMock: EmailSenderMock = new EmailSenderMock();

    // When: 테스트를 진행하는 단계
    const register: MemberRegister = new MemberService(
      new MemberRepositoryStub(),
      emailSenderMock,
      createPasswordEncoder(),
    );

    const member: Member = await register.register(
      createMemberRegisterRequest(),
    );

    // Then: 테스트 결과를 검증하는 단계
    expect(member.getId()).toBeDefined();
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);

    expect(emailSenderMock.getTos()).toHaveLength(1);
    expect(emailSenderMock.getTos()[0]).toEqual(member.getEmail());
  });

  it('registerTestMockFramework', async () => {
    const emailSenderMock = {
      send: jest.fn(),
    } as EmailSender;

    const register: MemberRegister = new MemberService(
      new MemberRepositoryStub(),
      emailSenderMock,
      createPasswordEncoder(),
    );

    const member: Member = await register.register(
      createMemberRegisterRequest(),
    );

    expect(member.getId()).toBeDefined();
    expect(member.getStatus()).toEqual(MemberStatus.PENDING);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailSenderMock.send).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailSenderMock.send).toHaveBeenCalledWith(
      member.getEmail(),
      expect.any(String),
      expect.any(String),
    );
  });
});

class MemberRepositoryStub implements MemberRepository {
  // eslint-disable-next-line
  async save(member: Member): Promise<Member> {
    member.setId(1);
    return member;
  }

  async findByEmail(email: Email): Promise<Member | undefined> {
    return undefined;
  }
}

class EmailSenderStub implements EmailSender {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(email: Email, subject: string, body: string): void {}
}

class EmailSenderMock implements EmailSender {
  tos: Email[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  send(email: Email, subject: string, body: string) {
    this.tos.push(email);
  }

  getTos(): Email[] {
    return this.tos;
  }
}
