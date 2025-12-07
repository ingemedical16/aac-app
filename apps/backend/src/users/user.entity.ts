import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Child } from '../children/child.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Child, (child) => child.user)
  children: Child[];
}
