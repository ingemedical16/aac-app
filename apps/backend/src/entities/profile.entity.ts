import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Child } from "./child.entity";
import { ProfileType } from "../common/enums/profileType.enum";
import { Sex } from "../common/enums/sex.enum";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /* =========================
     OWNERSHIP
  ========================= */

  @ManyToOne(() => User, (user) => user.profiles, {
    onDelete: "CASCADE",
  })
  owner!: User;

  @OneToOne(() => User, (user) => user.profile, {
    nullable: true,
  })
  user?: User | null;

  @OneToOne(() => Child, (child) => child.profile, {
    nullable: true,
  })
  child?: Child | null;

  /* =========================
     IDENTITY
  ========================= */

  @Column({ type: "varchar", length: 150 })
  displayName!: string;

  @Column({ type: "enum", enum: ProfileType })
  type!: ProfileType;

  @Column({ type: "varchar", length: 100, nullable: true })
  firstName!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  lastName!: string | null;

  @Column({ type: "date", nullable: true })
  dateOfBirth!: Date | null;

  @Column({ type: "enum", enum: Sex, nullable: true })
  sex!: Sex | null;

  @Column({ type: "varchar", nullable: true })
  avatarUrl!: string | null;

  /* =========================
     AAC SETTINGS
  ========================= */

  @Column({ type: "boolean", default: true })
  isPatient!: boolean;

  @Column({ type: "varchar", length: 10, default: "en" })
  primaryLanguage!: string;

  @Column({ type: "text", array: true })
  preferredLanguages!: string[];

  /* =========================
     SYSTEM
  ========================= */

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
