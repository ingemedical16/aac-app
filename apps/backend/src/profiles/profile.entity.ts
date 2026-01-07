import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Child } from "../children/child.entity";
import { ProfileType } from "../common/enums/profileType.enum";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /* =========================
     OWNERSHIP
  ========================= */

  @ManyToOne(() => User, (user) => user.profiles, {
    onDelete: "CASCADE",
  })
  owner: User;

 @Index()
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

  @Column({
    type: "simple-enum",
    enum: ProfileType,
  })
  type: ProfileType;

  /* =========================
     SETTINGS
  ========================= */

  @Column("simple-array",{ default: "" })
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