import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number
  @Column({length: 25})
  account:string
  @Column({length: 50})
  password:string
  @Column({length: 25})
  name:string
  @Column({length: 50,name: "photo"})
  photo:string
  constructor(a:string,b:string,c=a,d=""){
    this.account=a;
    this.password=b;
    this.name=c;
    this.photo=d;
  }
}