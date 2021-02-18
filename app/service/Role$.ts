import { Brackets, Repository } from "typeorm"
import { Role } from "../entity/Role"
import $ from "../think/service";
import { Cache, Maps, Redis } from "../config";
import { Menu } from "../entity/Menu";

export default class Role$ extends $ {
  constructor(
    private role:Repository<Role>=Cache["Role"],
    private menu:Repository<Menu>=Cache["Menu"]
  ) {
    super({
      leftJoin:{e:"role.menus",a:'menu'},
      addLeftJoin:{e:"role.users",a:'user'},
      addSelect:['user.id','user.name','menu.id','menu.name'],
      where: (query:{name:string}) => {
        return new Brackets(qb => {
          if (query.name) qb.where(`name like '%${query.name}%'`)
        });
      },
      orderBy: { "role.id": "desc" }
    });
  }
  
  async fix(id:number,role:Role) {
    let e=role.name;if(e===undefined) return await this.role.update(id,role);
    e=await this.role.findOne({id:id}) as any;const name=(e as any).name;Maps[role.name]=Maps[name];
    Redis.set(role.name,Maps[name].toString());Redis.del(name);Maps[name]=e=null;
    return await this.role.update(id,role)
  }
  *perm(roles:string) {
    return this.menu.createQueryBuilder("m").select(["m.type","m.path"])
    .leftJoin("m.roles","role").where(`role.name IN (${roles.replace(/([^,]+)/g,"'$1'")})`).getMany();
  }
}