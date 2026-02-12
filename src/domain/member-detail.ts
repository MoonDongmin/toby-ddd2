import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MemberDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profile: string;

  @Column()
  introduction: string;

  @Column()
  registeredAt: Date;

  @Column()
  activatedAt: Date;

  @Column()
  deactivatedAt: Date;
}
