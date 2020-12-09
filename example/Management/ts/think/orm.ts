import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
export abstract class Orm {
  @PrimaryGeneratedColumn({ comment: "序号"})
  id: number;
  @CreateDateColumn({ comment: "创建日期" })
  created: Date;
  @UpdateDateColumn({ comment: "修改日期" })
  updated: Date;
}
