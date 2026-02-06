import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@/domain/member';
import { MemberModule } from '@/application/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Member],
      synchronize: true,
      // dropSchema: true,
    }),
    TypeOrmModule.forFeature([Member]),
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
