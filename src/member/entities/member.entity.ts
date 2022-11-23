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
import { MemberCard } from './member-card.entity';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @ManyToOne(() => MemberCard)
  @JoinColumn()
  card: MemberCard;

  @Column()
  cardId: number;

  @Column()
  cardNo: string;

  @Column({ type: 'date' })
  startedAt: Date;

  @Column({ type: 'date', nullable: true, default: null })
  stoppedAt: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
