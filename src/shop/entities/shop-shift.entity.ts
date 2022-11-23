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
import { Shop } from './shop.entity';

@Entity('shop_shift')
export class ShopShift {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @Column()
  shopId: number;

  @Column({ type: 'datetime', nullable: true, default: null })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true, default: null })
  endedAt: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
