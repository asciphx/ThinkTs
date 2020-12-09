import { Entity, Column } from "typeorm";
import { Orm } from '../think/orm';

@Entity()
export class User extends Orm {
  @Column({ comment: "账户（3-10）", length: 10 })
  account: string
  @Column({ comment: "密码（6-25）", length: 50, select: false })
  pwd: string
  @Column({ comment: "昵称", length: 15 })
  name: string
  @Column({ comment: "头像", length: 50, name: "photo", nullable: true })
  photo: string
  @Column({ comment: "登录时间", nullable: true })
  logged : Date;
  constructor(e?: User) {
    super();
    if(e){
      this.account = e.account;
      this.pwd = e.pwd;
      this.name = e.name||e.account;
    }
  }
}