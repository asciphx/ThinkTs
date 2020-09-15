import { Brackets } from "typeorm"
import { Admin } from "../entity/Admin"
import { Service, Inject, container } from "../service";

export class AdminService extends Service {
  constructor(
    @Inject(Admin) private adm=container.get(Admin.name)
  ) {
    super({
      where: query => {
        return new Brackets(qb => {
          if (query.name) qb.where('name like :name', { name: `%${query.name}%` })
          if (query.id) qb.andWhere('id >:id', { id: query.id })
        });
      },
      orderBy: { "id": "desc" }
    });
  }
}
