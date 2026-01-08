import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Child } from "../children/child.entity";
import { ProfileType } from "../common/enums/profileType.enum";
import { Sex } from "../common/enums/sex.enum";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /* =========================
     OWNERSHIP
  ========================= */

  @ManyToOne(() => User, (user) => user.profiles, { onDelete: "CASCADE" })
  owner: User;

  @ManyToOne(() => Child, (child) => child.profiles, {
    nullable: true,
    onDelete: "SET NULL",
  })
  child?: Child | null;

  /* =========================
     IDENTITY
  ========================= */

  @Column()
  name: string;

  @Column({ type: "simple-enum", enum: ProfileType })
  type: ProfileType;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "simple-enum", enum: Sex, nullable: true })
  sex?: Sex;

  @Column({ nullable: true })
  avatarUrl?: string;

  /* =========================
     AAC SETTINGS
  ========================= */

  @Column({ default: true })
  isPatient: boolean;

  @Column({ default: "en" })
  primaryLanguage: string;

  @Column("simple-array")
  preferredLanguages: string[];

  @Column({ default: false })
  highContrast: boolean;

  @Column({ default: false })
  bigButtons: boolean;

  /* =========================
     METADATA
  ========================= */

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}