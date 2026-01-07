import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { UserRole } from "../common/enums/roles.enum";
import { Child } from "../children/child.entity";
import { Profile } from "../profiles/profile.entity";
import { Sex } from "../common/enums/sex.enum";


@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /* =========================
     AUTH
  ========================= */

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: "simple-enum",
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  /* =========================
     PATIENT / PERSON
  ========================= */

  /**
   * True if this user represents a patient
   * (adult patient OR parent managing children)
   */
  @Column({ default: false })
  isPatient: boolean;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({
    type: "simple-enum",
    enum: Sex,
    nullable: true,
  })
  sex?: Sex;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  /* =========================
     RELATIONS
  ========================= */

  /**
   * Children profiles owned by this user
   * Only meaningful if role === PATIENT
   */
  @OneToMany(() => Child, (child) => child.parent, {
    cascade: true,
  })
  children?: Child[];

  @OneToMany(() => Profile, (profile) => profile.owner)
    profiles: Profile[];

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