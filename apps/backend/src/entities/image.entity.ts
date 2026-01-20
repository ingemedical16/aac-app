import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("image_assets")
export class ImageAsset {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  url!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ length: 5 })
  lang!: string;
}
