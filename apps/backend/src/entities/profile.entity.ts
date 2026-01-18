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

  // Owner is always the user account
  @ManyToOne(() => User, (user) => user.profiles, {
    onDelete: "CASCADE",
  })
  owner!: User;

  // Profile belongs to either user OR child
  @OneToOne(() => User, (user) => user.profile, {
    nullable: true,
  })
  user?: User | null;

  @OneToOne(() => Child, (child) => child.profile, {
    nullable: true,
  })
  child?: Child | null;

  /* =========================
     IDENTITY (single source)
  ========================= */

  @Column()
  displayName!: string;

  @Column({ type: "simple-enum", enum: ProfileType })
  type!: ProfileType;

  @Column({ nullable: true })
  firstName?: string | null;

  @Column({ nullable: true })
  lastName?: string | null;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date | null;

  @Column({ type: "simple-enum", enum: Sex, nullable: true })
  sex?: Sex | null;

  @Column({ nullable: true })
  avatarUrl?: string | null;

  /* =========================
     AAC SETTINGS
  ========================= */

  @Column({ default: true })
  isPatient!: boolean;

  @Column({ default: "en" })
  primaryLanguage!: string;

  @Column("simple-array")
  preferredLanguages!: string[];

  /* =========================
     SYSTEM
  ========================= */

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
