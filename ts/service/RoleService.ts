import { Brackets, Repository } from "typeorm"
import { Role } from "../entity/Role"
import { Service } from "../service";
import { Cache, Maps } from "../../config";

export class RoleService extends Service {
  constructor(
    private role:Repository<Role>=Cache[Role.name]
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
    let e=role.name;if(e===undefined) return await this.role.update(id,role);
    e=await this.role.findOne({id:id}) as any;
    Maps[role.name]=Maps[(e as any).name];Maps[(e as any).name]=e=null;
    return await this.role.update(id,role)
  }
}
