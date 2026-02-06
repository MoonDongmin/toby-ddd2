import { Module } from '@nestjs/common';
import { MemberModifyService } from '@/application/member-modify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member';
import { MemberRepositoryImpl } from '@/adapter/persistence/member-repository-impl';
import { MEMBER_REPOSITORY } from '@/application/required/member-repository';
import { EMAIL_SENDER } from '@/application/required/email-sender';
import { PASSWORD_ENCODER } from '@/domain/password-encoder';
import { MemberQueryService } from '@/application/member-query.service';
import { MEMBER_FINDER } from '@/application/provided/member-finder';
import { SecurePasswordEncoder } from '@/adapter/security/secure-password-encoder';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
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
  ],
})
export class MemberModule {}
