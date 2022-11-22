import { Item } from 'src/item/entities/item.entity';
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
import { Transaction } from './transaction.entity';

@Entity('transaction-item')
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item)
  @JoinColumn()
  item: Item;

  @Column()
  itemId: number;

  @ManyToOne(() => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @Column()
  transactionId: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  tax: number;

  @Column()
  quantity: number;

  @Column({ type: 'int' })
  totalPrice: number;

  @Column({ type: 'int' })
  totalTax: number;

  // total = totalPrice + totalTax
  @Column({ type: 'int' })
  total: number;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
