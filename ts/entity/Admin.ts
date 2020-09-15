import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";
@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id:number
  @Column({comment: "游客名",length: 9})
  name:string
  @Column({comment: "标签",length: 30})
  label:string
  @CreateDateColumn({ comment: "加入日期" })
  created: Date;
  constructor(a:string,b?:string){
    this.name=a;
    this.label=b;
  }
}