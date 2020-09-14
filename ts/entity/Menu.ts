
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './Role';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;
  @Column({ comment: "名称", length: 9, unique: true })
  name: string;
  @Column({ comment: "图标", length: 9 })
  pic: string;
  @Column({ type: "tinyint", comment: "类型（0：目录、1：路由、2：按钮）" })
  type: number;
  @Column({ comment: "请求路径", length: 40 })
  path: string;
  @Column({ type: "tinyint", comment: "权重（0-99）" })
  weight: number;
  @CreateDateColumn({ comment: "创建日期" })
  created: Date;
  @ManyToMany(_ => Role, v => v.menus)
  @JoinTable({
    name: 'menu_role',
    joinColumn: { name: 'menu_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role;
}
