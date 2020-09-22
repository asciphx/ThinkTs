import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { Menu } from './Menu';
import { User } from './User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;
  @Index({ unique: true })
  @Column({ comment: "名称", length: 9 })
  name: string;
  @Column({ comment: "标签简介", nullable: true, length: 25 })
  remark: string;
  @ManyToMany(_ => Menu, v => v.roles)
  menus: Menu[];
  @ManyToMany(_ => User,v => v.roles)
  users: User[];

}