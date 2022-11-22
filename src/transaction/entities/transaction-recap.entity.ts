import { ShopShift } from 'src/shop/entities/shop-shift.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transaction_recap')
export class TransactionRecap {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ShopShift)
  @JoinColumn()
  shift: ShopShift;

  @Column()
  shiftId: number;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
