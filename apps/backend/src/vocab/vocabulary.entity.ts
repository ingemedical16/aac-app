import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column()
  imageUrl: string;

  @Column()
  lang: string;
}
