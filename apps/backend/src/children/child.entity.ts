import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm";
import {  User } from "../users/user.entity";
import { Profile } from "../profiles/profile.entity";
import { Sex } from "../common/enums/sex.enum";


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
     RELATIONS
  ========================= */

  @Index()
  @ManyToOne(() => User, (user) => user.children, {
    onDelete: "CASCADE",
  })
  parent: User;

  @OneToMany(() => Profile, (profile) => profile.child)
  profiles: Profile[];

  /* =========================
     SYSTEM
  ========================= */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
