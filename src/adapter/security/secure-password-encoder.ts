import { PasswordEncoder } from '@/domain/password-encoder';
import bcrypt from 'bcrypt';

export class SecurePasswordEncoder implements PasswordEncoder {
  encode(password: string): string {
    return bcrypt.hashSync(password, 4);
  }

  matches(password: string, passwordHash: string): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }
}
