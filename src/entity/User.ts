import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number
  @Column({length: 25})
  username:string
  @Column({length: 50})
  password:string
  @Column({length: 25})
  name:string
  @Column({length: 50,name: "photo"})
  photo:string
  constructor(a:string,b:string,c=a,d=""){
    this.username=a;
    this.password=b;
    this.name=c;
    this.photo=d;
  }
}