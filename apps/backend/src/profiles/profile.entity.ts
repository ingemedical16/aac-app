import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Child } from "../children/child.entity";


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

  @ManyToOne(() => Child, {
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
    type: "enum",
    enum: ["SELF", "CHILD"],
  })
  type: "SELF" | "CHILD";

  /* =========================
     SETTINGS
  ========================= */

  @Column("simple-array")
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