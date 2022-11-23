import { Member } from 'src/member/entities/member.entity';
import { ShopShift } from 'src/shop/entities/shop-shift.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionPaymentType } from './transaction-payment-type.entity';

@Entity('transaction_member_recap')
export class TransactionMemberRecap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  tax: number;

  @Column({ type: 'int', default: 0 })
  taxPctg: number;

  @Column({ type: 'int', default: 0 })
  service: number;

  @Column({ type: 'int', default: 0 })
  servicePctg: number;

  @Column({ type: 'int', default: 0 })
  total: number;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn()
  member: Member;

  @Column({ nullable: true, default: null })
  memberId: number;

  @ManyToOne(() => TransactionPaymentType, { nullable: true })
  @JoinColumn()
  paymentType: TransactionPaymentType;

  @Column({ nullable: true, default: null })
  paymentTypeId: number;

  @Column({ type: 'int', nullable: true, default: null })
  paid: number;

  @Column({ type: 'int', nullable: true, default: null })
  change: number;

  @Column({ type: 'datetime', nullable: true, default: null })
  paymentAt: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
