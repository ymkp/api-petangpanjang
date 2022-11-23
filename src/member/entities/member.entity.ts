import { TransactionMemberRecap } from 'src/transaction/entities/transaction-member-recap.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  @Column({ type: 'datetime', nullable: true, default: null })
  startedAt: Date;

  @OneToMany(() => Transaction, (t) => t.member)
  transactions: Transaction[];

  @OneToOne(() => TransactionMemberRecap, (t) => t.member, { nullable: true })
  @JoinColumn()
  transactionRecap: TransactionMemberRecap;

  @Column({ nullable: true, default: null })
  transactionRecapId: number;

  @Column({ type: 'datetime', nullable: true, default: null })
  stoppedAt: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
