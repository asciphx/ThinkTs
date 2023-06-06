import { Brackets } from "typeorm"
import { Role } from "../entity/Role"
import $, { Inject } from "../think/service";
import { Maps, Redis } from "../config";
import { Menu } from "../entity/Menu";

export default class Role$ extends $ {
  constructor(
    private r = Inject(Role), private m = Inject(Menu)
  ) {
    super({
      leftJoin: { e: "r.menus", a: 'Menu' },
      addLeftJoin: { e: "r.users", a: 'User' },
      addSelect: ['User.id', 'User.name', 'Menu.id', 'Menu.name'],
      where: (query: { name: string }) => new Brackets(qb => {
        if (query.name) qb.where(`r.name like '%${query.name}%'`)
      }),
      orderBy: { "r.id": "desc" }
    }, "r");
  }

  async fix(id: number, role: Role) {
    let e = role.name; if (e === undefined) return await this.r.update(id, role);
    e = await this.r.findOne({ where: { id: id } }) as any; const name = (e as any).name; Maps[role.name] = Maps[name];
    Redis.set(role.name, Maps[name].toString()); Redis.del(name); Maps[name] = e = null;
    return await this.r.update(id, role)
  }
  *perm(roles: string) {
    return this.m.createQueryBuilder("m").select(["m.type", "m.path"])
      .leftJoin("m.roles", "role").where(`role.name IN (${roles.replace(/([^,]+)/g, "'$1'")})`).getMany();
  }
}