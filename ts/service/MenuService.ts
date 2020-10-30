import { Brackets, Repository } from "typeorm"
import { Menu } from '../entity/Menu';
import { Service } from "../think/service";
import { Cache, Maps, Redis } from "../config";

export class MenuService extends Service {
  constructor(
    private menu:Repository<Menu>=Cache[Menu.name]
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
    });
  }
  async fix(id:number,menu:Menu) {
    let e=menu.path;if(e===undefined) return await this.menu.update(id,menu);
    e=await this.menu.findOne({id:id}) as any;
    let o=Object.entries(Maps),i=o.findIndex(v=>v[1].includes((e as any).path)),I=i>-1?Maps[o[i][0]]:undefined;
    if(I){
      I[I.findIndex(v=>v===(e as any).path)]=menu.path;
      Redis.set(o[i][0],I.toString());
    }I=o=e=null;
    return await this.menu.update(id,menu);
  }
  async add(menu:Menu) {
    if (menu.roles) menu.roles.forEach(e => {
      if (e.name) {
        Maps[e.name].push(menu.name);Redis.set(e.name,Maps[e.name].toString());
      }
    });
    return await this.menu.save(menu);
  }
}
