import { Brackets, getRepository } from "typeorm"
import { Admin } from "../entity/Admin"
import { Service } from "../service";

export class AdminService extends Service {
  constructor(
    private adm=getRepository(Admin)
  ) {
    super({
      where: query => {
        return new Brackets(qb => {
          if (query.name) qb.where('name like :name', { name: `%${query.name}%` })
          if (query.id) qb.andWhere('id >:id', { id: query.id })
        });
      },
      orderBy: { "id": "desc" }
    },"adm");//如本实体不是按照全名称全小写命名，需要控制规范，来避免额外开销
  }
}
