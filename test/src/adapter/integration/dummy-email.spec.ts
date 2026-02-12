import { DummyEmailSender } from '@/adapter/integration/dummy-email-sender';
import { Email } from '@/domain/shared/email';

describe('DummyEmailSenderTest', () => {
  it('dummyEmailSender', () => {
    const dummyEmailSender: DummyEmailSender = new DummyEmailSender();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    dummyEmailSender.send(new Email('dolor@gmail.com'), 'subject', 'body');

    expect(consoleSpy).toHaveBeenCalledWith(
      'DummyEmailSender send email: dolor@gmail.com',
    );
  });
});
