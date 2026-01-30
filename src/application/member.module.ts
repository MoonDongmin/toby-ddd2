import { Module } from '@nestjs/common';
import { MemberService } from '@/application/member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member';
import { MemberRepositoryImpl } from '@/adapter/persistence/member-repository-impl';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  exports: [MemberService],
  providers: [
    MemberService,
    {
      provide: 'MEMBER_REPOSITORY',
      useClass: MemberRepositoryImpl,
    },
    {
      provide: 'EMAIL_SENDER',
      useValue: null,
    },
    {
      provide: 'PASSWORD_ENCODER',
      useValue: null,
    },
  ],
})
export class MemberModule {}
