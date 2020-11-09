
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './Role';
//为兼容所以type与weight都换成了smallint，但mysql则可以支持tinyint，
@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;
  @Column({ type: "smallint", comment: "父节点id",default:0 })
  pid: number;
  @Column({ comment: "名称", length: 10, unique: true })
  name: string;
  @Column({ type: "smallint", comment: "类型（0：目录、1：路由[后端]、2：按钮）",default:1 })
  type: number;
  @Column({ type: "smallint", comment: "权重（0-99）",default:99 })
  weight: number;
  @Column({ comment: "前端标识", length: 15,default:"" })
  perm: string;
  @Column({ comment: "请求方法路径，比如GET/menu", length: 40 })
  path: string;
  @Column({ comment: "图标", length: 25 ,nullable:true })
  pic: string;
  @ManyToMany(_ => Role, v => v.menus, { cascade: ['insert', 'remove'] })
  @JoinTable({
    name: 'menu_role',
    joinColumn: { name: 'menu_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];
}
