import { Module } from '@nestjs/common';
import { MemberService } from '@/application/member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  exports: [MemberService],
  providers: [MemberService],
})
export class MemberModule {}
