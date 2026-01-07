import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { User } from "../users/user.entity";
import { Profile } from "../profiles/profile.entity";

export enum Sex {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@Entity("children")
export class Child {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100, nullable: true })
  lastName?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({
    type: "simple-enum",
    enum: Sex,
    nullable: true,
  })
  sex?: Sex;

  /* =========================
     AAC / PROFILE
  ========================= */



  /* =========================
     RELATIONS
  ========================= */

  @Index()
  @ManyToOne(() => User, (user) => user.children, {
    onDelete: "CASCADE",
  })
  parent: User;

  @OneToMany(() => Profile, (profile) => profile.owner)
  profiles: Profile[];

  /* =========================
     SYSTEM
  ========================= */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}