import { EmailSender } from '@/application/required/email-sender';
import { Email } from '@/domain/email';

export class DummyEmailSender implements EmailSender {
  send(email: Email, subject: string, body: string): void {
    console.log(`DummyEmailSender send email: ${email.getAddress()}`);
  }
}
