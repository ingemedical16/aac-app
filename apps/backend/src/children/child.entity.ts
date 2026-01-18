import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User } from "../users/user.entity";
import { Profile } from "../profiles/profile.entity";

@Entity("children")
export class Child {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /* =========================
     RELATION
  ========================= */

  @ManyToOne(() => User, (user) => user.children, {
    onDelete: "CASCADE",
  })
  parent!: User;

  // Child identity lives in Profile
  @OneToOne(() => Profile, (profile) => profile.child, {
    cascade: true,
  })
  @JoinColumn()
  profile!: Profile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
