import { Module } from '@nestjs/common';
import { MemberModifyService } from '@/application/member/member-modify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member/member';
import { MemberRepositoryImpl } from '@/adapter/persistence/member-repository-impl';
import { MEMBER_REPOSITORY } from '@/application/member/required/member-repository';
import { EMAIL_SENDER } from '@/application/member/required/email-sender';
import { PASSWORD_ENCODER } from '@/domain/member/password-encoder';
import { MemberQueryService } from '@/application/member/member-query.service';
import { MEMBER_FINDER } from '@/application/member/provided/member-finder';
import { SecurePasswordEncoder } from '@/adapter/security/secure-password-encoder';
import { MemberController } from '@/adapter/webapi/member.controller';
import { MEMBER_REGISTER } from '@/application/member/provided/member-register';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  exports: [MemberModifyService],
  providers: [
    MemberModifyService,
    MemberQueryService,
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepositoryImpl,
    },
    {
      provide: EMAIL_SENDER,
      useValue: null,
    },
    {
      provide: PASSWORD_ENCODER,
      useValue: null,
    },
    {
      provide: MEMBER_FINDER,
      useClass: MemberQueryService,
    },
    {
      provide: PASSWORD_ENCODER,
      useClass: SecurePasswordEncoder,
    },
    {
      provide: MEMBER_REGISTER,
      useClass: MemberModifyService,
    },
  ],
})
export class MemberModule {}
