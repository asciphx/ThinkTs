import { Brackets, Repository } from "typeorm"
import { Role } from "../entity/Role"
import { Service } from "../service";
import { Conf, Maps } from "../../config";
import { Menu } from "../entity/Menu";

export class RoleService extends Service {
  constructor(
    private role:Repository<Role>=Conf[Role.name],
    private menu:Repository<Menu>=Conf[Menu.name]
  ) {
    super({
      leftJoin:{e:"role.menus",a:'menu'},
      addLeftJoin:{e:"role.users",a:'user'},
      addSelect:['user.id','user.name','menu.id','menu.name'],
      where: (query:{name:string}) => {
        return new Brackets(qb => {
          if (query.name) qb.where('name like :v', { v: `%${query.name}%` })
        });
      },
      orderBy: { "role.id": "desc" }
    });
  }
  
  async fix(id:number,role:Role) {
    let insert=await this.role.update(id,role),e=role.name;
    if(e===undefined) return insert;
    else (e as any)=await this.role.findOne({id:id});
    const m=await this.menu.createQueryBuilder("m").leftJoin("m.roles","role")
    .select("m.path").where("role.name =:e",{e:e}).getMany();
    m.forEach((e,i,l)=>{(l[i] as any)=e.path});Maps[e]=m
    return insert
  }
}
