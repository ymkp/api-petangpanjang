import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity('member_card')
export class MemberCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNo: string;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn()
  member: Member;

  @Column({ nullable: true, default: null })
  memberId: number;

  @Column({ type: 'date', nullable: true, default: null })
  publishedAt: Date;

  // 1 tahun (365 days) after publishedAt
  @Column({ type: 'date', nullable: true, default: null })
  expiredAt: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
