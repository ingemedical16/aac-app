import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { UserRole } from "../auth/roles.enum";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /* =========================
     AUTH
  ========================= */

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // 👈 Hides password from all queries
  password: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.PARENT,
  })
  role: UserRole;

  /* =========================
     PROFILE (optional / future)
  ========================= */

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  /* =========================
     SYSTEM
  ========================= */

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}