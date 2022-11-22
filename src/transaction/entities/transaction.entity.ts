import { Member } from 'src/member/entities/member.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionItem } from './transaction-item.entity';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @Column()
  shopId: number;

  @OneToMany(() => TransactionItem, (d) => d.transaction, { eager: true })
  items: TransactionItem[];

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

  @Column({ type: 'datetime', nullable: true, default: null })
  closedAt: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
