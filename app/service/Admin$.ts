import { Brackets } from "typeorm"
import { Admin } from "../entity/Admin"
import $, { Inject } from "../think/service";
export default class Admin$ extends $ {
  constructor(
    private a = Inject(Admin)
  ) {
    super({
      select: ['a.id', 'a.name', 'a.label'],
      where: (query: { name: string }) => new Brackets(qb => {
        if (query.name) qb.where("name IN (:...names)", { names: query.name.split(",") })
      }),
      orderBy: { "id": "desc" }
    }, "a");
  }
}
