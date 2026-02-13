import { MemberRepository } from '@/application/member/required/member-repository';
import { Email } from '@/domain/shared/email';
import { Member } from '@/domain/member/member';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Profile } from '@/domain/member/profile';

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

  async findById(memberId: number): Promise<Member | null> {
    const existMember: Member | null = await this.memberRepository.findOneBy({
      id: memberId,
    } as any);

    if (!existMember) {
      return null;
    }

    return existMember;
  }

  async findByProfile(profile: Profile): Promise<Member | null> {
    return this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.detail', 'detail')
      .where('detail.profile_address = :address', {
        address: profile.getAddress(),
      })
      .getOne();
  }
}
