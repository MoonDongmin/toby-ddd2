import { MemberRepository } from '@/application/required/member-repository';
import { Email } from '@/domain/email';
import { Member } from '@/domain/member';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberRepositoryImpl implements MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async save(member: Member): Promise<Member> {
    return this.memberRepository.save(member);
  }

  async findByEmail(email: Email): Promise<Member | null> {
    const existMember: Member | null = await this.memberRepository.findOneBy({
      email,
    } as any);

    if (!existMember) {
      return null;
    }

    return existMember;
  }
}
