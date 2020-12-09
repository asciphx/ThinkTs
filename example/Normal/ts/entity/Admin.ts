import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";
@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id:number
  @Column({comment: "游客名",length: 9})
  name:string
  @Column({comment: "标签",length: 30,default:""})
  label:string
  @CreateDateColumn({ comment: "加入日期" })
  created: Date;
  constructor(e?: Admin){
    if(e){
      this.name=e.name;
      this.label=e.label||"";
    }
  }
}