import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("vocabularies")
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: "text" })
  word!: string;

  @Index()
  @Column({ type: "varchar", length: 10 })
  lang!: string;

  @Column({ type: "text", nullable: true })
  imageUrl?: string | null;

  @Index()
  @Column({ type: "varchar", length: 100, nullable: true })
  category?: string | null;
}
