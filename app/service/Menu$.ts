import { Brackets } from "typeorm"
import { Menu } from '../entity/Menu';
import $, { Inject } from "../think/service";
import { Maps, Redis } from "../config";

export default class Menu$ extends $ {
  constructor(
    public m = Inject(Menu)
  ) {
    super({
      leftJoin: { e: "m.roles", a: 'Role' },
      select: ['m.id', 'm.name', 'm.pic'],
      addSelect: ['Role.id', 'Role.name'],
      where: (query: { name: string }) => new Brackets(qb => {
        if (query.name) qb.where("m.name IN (:...arr)", { arr: query.name.match(/[^,]+/g) })
      }),
      orderBy: { "m.id": "desc" }
    }, "m");
  }
  async fix(id: number, menu: Menu) {
    let e = menu.path; if (e === undefined) return await this.m.update(id, menu);
    e = await this.m.findOne({ where: { id: id } }) as any;
    let o = Object.entries(Maps), i = o.findIndex(v => v[1].includes((e as any).path)), I = i > -1 ? Maps[o[i][0]] : 0;
    if (I) {
      I[I.findIndex(v => v === (e as any).path)] = menu.path;
      Redis.set(o[i][0], I.toString()); I = null
    } o = e = null;
    return await this.m.update(id, menu);
  }
  async add(menu: Menu) {
    if (menu.roles) menu.roles.forEach(e => {
      if (e.name) {
        Maps[e.name].push(menu.name); Redis.set(e.name, Maps[e.name].toString());
      }
    });
    return await this.m.save(menu);
  }
}