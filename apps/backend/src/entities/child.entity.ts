import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Profile } from "./profile.entity";

@Entity("children")
export class Child {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /* =========================
     RELATIONS
  ========================= */

  // Child belongs to a user
  @ManyToOne(() => User, (user) => user.children, {
    onDelete: "CASCADE",
  })
  parent!: User;

  // Child has exactly one profile
  @OneToOne(() => Profile, (profile) => profile.child, {
    cascade: true,
  })
  @JoinColumn()
  profile!: Profile;

  /* =========================
     SYSTEM
  ========================= */

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
