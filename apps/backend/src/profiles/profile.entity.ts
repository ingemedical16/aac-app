import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
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
  id!: string;

  /* =========================
     OWNERSHIP
  ========================= */

  @ManyToOne(() => User, (user) => user.profiles, {
    onDelete: "CASCADE",
  })
  owner!: User;

  // Profile belongs to either user or child
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
