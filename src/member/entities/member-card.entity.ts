import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('member_card')
export class MemberCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNo: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true, default: null })
  lockerNo: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
