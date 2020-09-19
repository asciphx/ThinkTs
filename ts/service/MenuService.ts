import { Brackets, Repository } from "typeorm"
import { Menu } from "../entity/Menu"
import { Service } from "../service";
import { Conf } from "../../config";

export class MenuService extends Service {
  constructor(
    private menu:Repository<Menu>=Conf[Menu.name]
  ) {
    super({
      leftJoin:{e:"menu.roles",a:'role'},
      select:[ 'menu.id', 'menu.name', 'menu.pic'],
      addSelect:['role.id','role.name'],
      where: (query:{name:string}) => {
        return new Brackets(qb => {
          if (query.name) qb.where("name IN (:...arr)", { arr: query.name.match(/[^,]+/g) })
        });
      },
      orderBy: { "menu.id": "desc" }
    });//http://localhost:3000/menu?name=menu,log,human 那么查找这三个名称的菜单
  }
}
