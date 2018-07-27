import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid') id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column('text', { default: '' })
  description: string;

  @Column() filename: string;

  @Column('varchar', { default: '', length: 6 })
  dominantColor: string;

  @Column('double', { default: 0 })
  views: number;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: false })
  deleted: boolean;

  @ManyToOne(() => User, user => user.photos)
  user: User;
}
