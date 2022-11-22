import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  password: string;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;

  @Column({ default: false, nullable: true })
  isAccountDisabled: boolean;

  @Column({ default: false, nullable: true })
  isSuperAdmin: boolean;

  // @Column({ default: null })
  // shopId: number;

  @Column({ default: false, nullable: true })
  isManager: boolean;

  @Column({ default: false, nullable: true })
  isWaiter: boolean;

  @Column({ default: false, nullable: true })
  isCashier: boolean;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @Unique('identificationNo', ['identificationNo'])
  @Column({ length: 15 })
  identificationNo: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
