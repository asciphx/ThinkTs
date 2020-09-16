import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Orm } from '../orm';
import { Role } from "./Role";

@Entity()
export class User extends Orm {
  @Column({ comment: "账户", length: 10, unique: true })
  account: string
  @Column({ comment: "密码（select禁用）", length: 40, select: false })
  pwd: string
  @Column({ comment: "昵称", length: 15 })
  name: string
  @Column({ default: true, comment: '默认状态：1，未禁用' })
  status: boolean
  @Column({ comment: "电话", length: 12, nullable: true })
  phone: string;
  @Column({ comment: "头像", length: 50, name: "photo", nullable: true })
  photo: string
  @Column({ comment: "登录时间", nullable: true })
  logged : Date;
  @ManyToMany(_ => Role, v => v.users, { cascade: ['insert', 'remove'] })
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[]
  constructor(a: string, b: string, c?: string) {
    super();
    this.account = a;
    this.pwd = b;
    this.name = c?c:a;
  }
}