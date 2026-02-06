import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { MemberModifyService } from '@/application/member-modify.service';
import { MemberQueryService } from '@/application/member-query.service';
import { MemberRegister } from '@/application/provided/member-register';
import { MemberFinder } from '@/application/provided/member-finder';
import { DataSource } from 'typeorm';
import { SplearnTestConfiguration } from './splearn-test-configuration';
import { EMAIL_SENDER } from '@/application/required/email-sender';
import { PASSWORD_ENCODER } from '@/domain/password-encoder';

describe('Application Bootstrap (e2e)', () => {
  let app: INestApplication;
  let memberRegister: MemberRegister;
  let memberFinder: MemberFinder;
  let dataSource: DataSource;

  const config = new SplearnTestConfiguration();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EMAIL_SENDER)
      .useValue(config.emailSender())
      .overrideProvider(PASSWORD_ENCODER)
      .useValue(config.passwordEncoder())
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    memberRegister =
      moduleFixture.get<MemberModifyService>(MemberModifyService);
    memberFinder = moduleFixture.get<MemberQueryService>(MemberQueryService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  it('should bootstrap application successfully', () => {
    console.log(app);
    expect(app).toBeDefined();
  });

  // it('should apply global ValidationPipe', () => {
  //   const httpAdapter = app.getHttpAdapter();
  //   expect(httpAdapter).toBeDefined();
  // });
  //
  // it('should have DataSource connection', async () => {
  //   expect(dataSource).toBeDefined();
  //   expect(dataSource.isInitialized).toBe(true);
  // });
  //
  // it('should have required services registered', () => {
  //   expect(memberRegister).toBeDefined();
  //   expect(memberFinder).toBeDefined();
  //   expect(memberRegister).toBeInstanceOf(MemberModifyService);
  //   expect(memberFinder).toBeInstanceOf(MemberQueryService);
  // });
});
