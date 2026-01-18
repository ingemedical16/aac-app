import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { UserRole } from "../common/enums/roles.enum";
import { Profile } from "./profile.entity";
import { Child } from "./child.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: "simple-enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  /* =========================
     RELATIONS
  ========================= */

  // Personal profile (1:1)
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn()
  profile!: Profile;

  // Owns all profiles (personal + children)
  @OneToMany(() => Profile, (profile) => profile.owner)
  profiles!: Profile[];

  // Owns children
  @OneToMany(() => Child, (child) => child.parent)
  children!: Child[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
