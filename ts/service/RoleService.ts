import { Brackets } from "typeorm"
import { Role } from "../entity/Role"
import { Service } from "../service";
import { Page } from '../utils/page';
import { Conf } from "../../config";

export class RoleService extends Service {
  constructor(
    private role=Conf[Role.name]
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
}
