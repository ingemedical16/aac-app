import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ImageAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  description: string;

  @Column()
  lang: string;
}
