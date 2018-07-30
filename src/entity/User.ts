import * as bcrypt from 'bcryptjs';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn
} from 'typeorm';
import { Photo } from './Photo';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20, nullable: true })
  username: string;

  @Column('varchar', { length: 15, nullable: true })
  mobile: string;

  @Column('text')
  password: string;
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  forgotPasswordLocked: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];
}
