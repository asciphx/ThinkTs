import { Brackets, Repository } from "typeorm"
import { Menu } from '../entity/Menu';
import { Service } from "../service";
import { Conf, Maps } from "../../config";

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
  async fix(id:number,menu:Menu) {
    let e=menu.path;if(e===undefined) return await this.menu.update(id,menu);
      else (e as string|Menu)=await this.menu.findOne({id:id});
    const entries=Object.entries(Maps),i=entries.findIndex(v=>v[1].includes((e as any).path))
    if(i>-1)Maps[entries[i][0]][i]=menu.path;
    return await this.menu.update(id,menu);
  }
}
