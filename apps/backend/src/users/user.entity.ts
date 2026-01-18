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
import { Profile } from "../profiles/profile.entity";
import { Child } from "../children/child.entity";

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

  // User identity
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn()
  profile!: Profile;

  // Children relations
  @OneToMany(() => Child, (child) => child.parent)
  children!: Child[];

  // Ownership of all profiles
  @OneToMany(() => Profile, (profile) => profile.owner)
  profiles!: Profile[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
