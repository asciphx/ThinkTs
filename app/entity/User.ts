import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Orm } from '../think/orm';
import { Role } from "./Role";
@Entity()
export class User extends Orm {
  @Column({ comment: "账户（3-10）", length: 10 })
  account: string
  @Column({ comment: "密码（6-25）", length: 50, select: false })
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
  constructor(e?: User) {
    super();
    if(e){
      this.account = e.account;
      this.pwd = e.pwd;
      this.name = e.name||e.account;
    }
  }
}